import { ref, computed, onUnmounted } from 'vue'
import {
    collection,
    addDoc,
    query,
    where,
    onSnapshot,
    orderBy
} from 'firebase/firestore'
import { db } from '../firebase.js'
import { format, subDays, startOfMonth, eachDayOfInterval } from 'date-fns'

import { useUser } from './useUser.js'

const expenses = ref([])
const isLoading = ref(true)
let unsubscribe = null

export function useExpenses() {
    const { currentUser } = useUser()
    const today = format(new Date(), 'yyyy-MM-dd')
    const monthStart = format(startOfMonth(new Date()), 'yyyy-MM-dd')

    // Subscribe to expenses from the start of the month
    function subscribe() {
        if (unsubscribe) unsubscribe() // Always reset on re-subscribe in case user changed

        if (!currentUser.value) {
            expenses.value = []
            isLoading.value = false
            return
        }

        isLoading.value = true

        const q = query(
            collection(db, 'expenses'),
            where('username', '==', currentUser.value),
            where('date', '>=', monthStart),
            orderBy('date', 'asc')
        )

        unsubscribe = onSnapshot(q, (snapshot) => {
            expenses.value = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }))
            isLoading.value = false
        }, (error) => {
            console.error(error)
            isLoading.value = false
        })
    }

    function cleanup() {
        if (unsubscribe) {
            unsubscribe()
            unsubscribe = null
        }
    }

    // Stats
    const totalToday = computed(() => {
        return expenses.value
            .filter((e) => e.date === today)
            .reduce((sum, e) => sum + (e.total || 0), 0)
    })

    const totalMonth = computed(() => {
        return expenses.value.reduce((sum, e) => sum + (e.total || 0), 0)
    })

    const avgPerDay = computed(() => {
        const now = new Date()
        const dayOfMonth = now.getDate()
        if (dayOfMonth === 0) return 0
        return Math.round(totalMonth.value / dayOfMonth)
    })

    // Chart data helpers
    function getDailyTotals(days) {
        const now = new Date()
        const interval = eachDayOfInterval({
            start: subDays(now, days - 1),
            end: now
        })

        const dateMap = {}
        interval.forEach((d) => {
            dateMap[format(d, 'yyyy-MM-dd')] = 0
        })

        expenses.value.forEach((e) => {
            if (dateMap[e.date] !== undefined) {
                dateMap[e.date] += e.total || 0
            }
        })

        return {
            labels: interval.map((d) => format(d, 'MMM dd')),
            data: interval.map((d) => dateMap[format(d, 'yyyy-MM-dd')])
        }
    }

    const chartData7 = computed(() => getDailyTotals(7))
    const chartData30 = computed(() => getDailyTotals(30))

    // Grouped list for any view that needs it
    const groupedExpenses = computed(() => {
        const groups = {}
        expenses.value.forEach((e) => {
            if (!groups[e.date]) groups[e.date] = []
            groups[e.date].push(e)
        })
        // Sort dates descending
        return Object.keys(groups)
            .sort((a, b) => b.localeCompare(a))
            .map((date) => ({
                date,
                items: groups[date]
            }))
    })

    // Get single expense
    async function getExpense(id) {
        const { doc, getDoc } = await import('firebase/firestore')
        const snap = await getDoc(doc(db, 'expenses', id))
        if (snap.exists()) {
            return { id: snap.id, ...snap.data() }
        }
        return null
    }

    // Save expense (create)
    async function saveExpense(date, items) {
        if (!currentUser.value) return
        const total = items.reduce((sum, i) => sum + Number(i.price), 0)
        await addDoc(collection(db, 'expenses'), {
            username: currentUser.value,
            date,
            items: items.map((i) => ({ name: i.name, price: Number(i.price) })),
            total
        })
    }

    // Update expense
    async function updateExpense(id, date, items) {
        if (!currentUser.value) return
        const { doc, updateDoc } = await import('firebase/firestore')
        const total = items.reduce((sum, i) => sum + Number(i.price), 0)

        await updateDoc(doc(db, 'expenses', id), {
            date,
            items: items.map((i) => ({ name: i.name, price: Number(i.price) })),
            total
        })
    }

    // Delete expense
    async function deleteExpense(id) {
        const { doc, deleteDoc } = await import('firebase/firestore')
        await deleteDoc(doc(db, 'expenses', id))
    }

    return {
        expenses,
        isLoading,
        subscribe,
        cleanup,
        totalToday,
        totalMonth,
        avgPerDay,
        chartData7,
        chartData30,
        groupedExpenses,
        saveExpense,
        updateExpense,
        getExpense,
        deleteExpense
    }
}
