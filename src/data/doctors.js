const doctors = [
    {
        id: 'dr-santos',
        name: 'Dr. Maria Santos',
        specialty: 'Internal Medicine & Peptide Therapy',
        avatar: '👩‍⚕️',
        bio: 'Board-certified internist with 12+ years of experience in integrative and peptide-based medicine.',
        availableSlots: [
            { date: '2026-02-20', times: ['09:00 AM', '10:00 AM', '02:00 PM', '04:00 PM'] },
            { date: '2026-02-21', times: ['09:00 AM', '11:00 AM', '03:00 PM'] },
            { date: '2026-02-22', times: ['10:00 AM', '01:00 PM', '04:00 PM'] },
            { date: '2026-02-24', times: ['09:00 AM', '11:00 AM', '02:00 PM'] },
            { date: '2026-02-25', times: ['10:00 AM', '02:00 PM', '03:00 PM'] },
        ],
    },
    {
        id: 'dr-reyes',
        name: 'Dr. Carlo Reyes',
        specialty: 'Family Medicine & Anti-Aging',
        avatar: '👨‍⚕️',
        bio: 'Specialist in regenerative medicine and anti-aging protocols with a focus on peptide therapy.',
        availableSlots: [
            { date: '2026-02-20', times: ['10:00 AM', '01:00 PM', '03:00 PM'] },
            { date: '2026-02-21', times: ['09:00 AM', '02:00 PM', '04:00 PM'] },
            { date: '2026-02-23', times: ['10:00 AM', '11:00 AM', '03:00 PM'] },
            { date: '2026-02-24', times: ['09:00 AM', '01:00 PM', '04:00 PM'] },
            { date: '2026-02-26', times: ['10:00 AM', '02:00 PM'] },
        ],
    },
    {
        id: 'dr-lim',
        name: 'Dr. Patricia Lim',
        specialty: 'Endocrinology & Metabolic Health',
        avatar: '👩‍⚕️',
        bio: 'Endocrinologist specializing in metabolic optimization and medically supervised peptide programs.',
        availableSlots: [
            { date: '2026-02-21', times: ['09:00 AM', '10:00 AM', '02:00 PM'] },
            { date: '2026-02-22', times: ['11:00 AM', '01:00 PM', '04:00 PM'] },
            { date: '2026-02-24', times: ['09:00 AM', '10:00 AM', '03:00 PM'] },
            { date: '2026-02-25', times: ['11:00 AM', '02:00 PM', '04:00 PM'] },
            { date: '2026-02-27', times: ['09:00 AM', '01:00 PM'] },
        ],
    },
];

export default doctors;
