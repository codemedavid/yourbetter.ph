import { createContext, useContext, useReducer, useEffect } from 'react';

const AssessmentContext = createContext(null);

const STATUS = {
    IDLE: 'IDLE',
    CREATED: 'CREATED',
    ASSESSED: 'ASSESSED',
    RECOMMENDED: 'RECOMMENDED',
    BOOKED: 'BOOKED',
    MD_APPROVED: 'MD_APPROVED',
    ADMIN_CLEARED: 'ADMIN_CLEARED',
    PURCHASE_ENABLED: 'PURCHASE_ENABLED',
};

function generateAONumber() {
    const date = new Date();
    const d = date.toISOString().slice(0, 10).replace(/-/g, '');
    const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `AO-${d}-${rand}`;
}

const initialState = {
    aoNumber: null,
    status: STATUS.IDLE,
    consent: false,
    assessmentAnswers: null,
    recommendations: [],
    booking: null,
    credentials: null,
    allowedProducts: [],
    mdNotes: '',
    orders: [],
};

function loadState() {
    try {
        const raw = localStorage.getItem('yourbetter_current');
        return raw ? { ...initialState, ...JSON.parse(raw) } : initialState;
    } catch {
        return initialState;
    }
}

function reducer(state, action) {
    switch (action.type) {
        case 'ACCEPT_TERMS': {
            const aoNumber = generateAONumber();
            const newState = {
                ...state,
                consent: true,
                aoNumber,
                status: STATUS.CREATED,
            };
            saveToAllOrders(newState);
            return newState;
        }
        case 'SUBMIT_ASSESSMENT': {
            const newState = {
                ...state,
                assessmentAnswers: action.payload.answers,
                recommendations: action.payload.recommendations,
                credentials: action.payload.credentials,
                status: STATUS.RECOMMENDED,
            };
            saveToAllOrders(newState);
            return newState;
        }
        case 'BOOK_MD': {
            const newState = {
                ...state,
                booking: action.payload,
                status: STATUS.BOOKED,
            };
            saveToAllOrders(newState);
            return newState;
        }
        case 'SET_STATUS': {
            const newState = { ...state, status: action.payload };
            saveToAllOrders(newState);
            return newState;
        }
        case 'UPDATE_FROM_ADMIN': {
            const newState = { ...state, ...action.payload };
            saveToAllOrders(newState);
            return newState;
        }
        case 'ADD_ORDER': {
            const newState = { ...state, orders: [...state.orders, action.payload] };
            saveToAllOrders(newState);
            return newState;
        }
        case 'LOAD_ORDER': {
            return { ...initialState, ...action.payload };
        }
        case 'RESET': {
            return initialState;
        }
        default:
            return state;
    }
}

function saveToAllOrders(orderState) {
    if (!orderState.aoNumber) return;
    try {
        const all = JSON.parse(localStorage.getItem('yourbetter_all_orders') || '[]');
        const idx = all.findIndex(o => o.aoNumber === orderState.aoNumber);
        if (idx >= 0) {
            all[idx] = orderState;
        } else {
            all.push(orderState);
        }
        localStorage.setItem('yourbetter_all_orders', JSON.stringify(all));
    } catch { /* ignore */ }
}

export function getAllOrders() {
    try {
        return JSON.parse(localStorage.getItem('yourbetter_all_orders') || '[]');
    } catch {
        return [];
    }
}

export function updateOrderInStorage(aoNumber, updates) {
    try {
        const all = getAllOrders();
        const idx = all.findIndex(o => o.aoNumber === aoNumber);
        if (idx >= 0) {
            all[idx] = { ...all[idx], ...updates };
            localStorage.setItem('yourbetter_all_orders', JSON.stringify(all));
        }
    } catch { /* ignore */ }
}

export function AssessmentProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, null, loadState);

    useEffect(() => {
        localStorage.setItem('yourbetter_current', JSON.stringify(state));
    }, [state]);

    return (
        <AssessmentContext.Provider value={{ state, dispatch, STATUS }}>
            {children}
        </AssessmentContext.Provider>
    );
}

export function useAssessment() {
    const ctx = useContext(AssessmentContext);
    if (!ctx) throw new Error('useAssessment must be used inside AssessmentProvider');
    return ctx;
}

// === Payment Methods helpers ===
export function getPaymentMethods() {
    try {
        return JSON.parse(localStorage.getItem('yourbetter_payment_methods') || '[]');
    } catch { return []; }
}
export function savePaymentMethods(methods) {
    localStorage.setItem('yourbetter_payment_methods', JSON.stringify(methods));
}

// === Products helpers (seeded from peptides.js on first load) ===
export function getProducts() {
    try {
        const raw = localStorage.getItem('yourbetter_products');
        if (raw) return JSON.parse(raw);
        return null; // caller should seed
    } catch { return null; }
}
export function saveProducts(products) {
    localStorage.setItem('yourbetter_products', JSON.stringify(products));
}

// === Aggregated orders across all assessments ===
export function getAllAggregatedOrders() {
    const allAssessments = getAllOrders();
    const orders = [];
    allAssessments.forEach(a => {
        if (a.orders && a.orders.length > 0) {
            a.orders.forEach(o => {
                orders.push({ ...o, aoNumber: a.aoNumber, assessmentEmail: a.assessmentAnswers?.email });
            });
        }
    });
    return orders;
}

export { STATUS };
export default AssessmentContext;
