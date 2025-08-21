import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bell, ChevronDown, Search, X, Check, Clock, AlertTriangle, Globe, Loader2, Filter, RefreshCw } from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

// Composant Logo ViaDomin's
const ViaDominLogo = () => (
    <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-2"
    >
        <Globe className="w-6 h-6 text-[#00D09C]" />
        <span className="text-xl font-bold bg-gradient-to-r from-[#00D09C] to-[#702FFF] bg-clip-text text-transparent">
                ViaDomin's
            </span>
    </motion.div>
);

// Composant SearchInput amélioré
const SearchInput = ({ placeholder, value, onChange }) => (
    <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#00D09C] focus:border-transparent transition-all duration-200 text-sm"
        />
    </div>
);

// Composant FilterDropdown amélioré
const FilterDropdown = ({ options = [], selected, onSelect, label = 'Filter', icon }) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectedOption = options.find(opt => opt.value === selected) || { label };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex justify-between items-center w-full px-4 py-3 border border-gray-300 bg-white rounded-xl shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#00D09C] transition-all duration-200"
                aria-haspopup="listbox"
                aria-expanded={isOpen}
            >
                <div className="flex items-center gap-2">
                    {icon && <span className="text-gray-500">{icon}</span>}
                    <span>{selectedOption.label}</span>
                </div>
                <ChevronDown className={`ml-2 h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute z-20 mt-2 w-full bg-white shadow-xl rounded-xl py-2 ring-1 ring-black ring-opacity-5 border border-gray-100"
                    >
                        {options.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => {
                                    onSelect(option.value);
                                    setIsOpen(false);
                                }}
                                className={`w-full text-left px-4 py-3 text-sm flex items-center justify-between transition-colors duration-200 ${
                                    selected === option.value
                                        ? 'bg-[#00D09C]/10 text-[#00D09C] font-medium'
                                        : 'text-gray-700 hover:bg-gray-50'
                                }`}
                                role="option"
                                aria-selected={selected === option.value}
                            >
                                <span>{option.label}</span>
                                {selected === option.value && (
                                    <Check className="h-4 w-4 text-[#00D09C]" />
                                )}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// Composant StatusBadge amélioré
const StatusBadge = ({ status = 'pending' }) => {
    const statusConfig = {
        offline: {
            bg: 'bg-red-100',
            text: 'text-red-800',
            icon: <X className="h-3 w-3" />,
            label: 'Offline',
            border: 'border-red-200'
        },
        expiring: {
            bg: 'bg-yellow-100',
            text: 'text-yellow-800',
            icon: <AlertTriangle className="h-3 w-3" />,
            label: 'Expiration',
            border: 'border-yellow-200'
        },
        ssl: {
            bg: 'bg-purple-100',
            text: 'text-purple-800',
            icon: <AlertTriangle className="h-3 w-3" />,
            label: 'SSL Expiré',
            border: 'border-purple-200'
        },
        resolved: {
            bg: 'bg-green-100',
            text: 'text-green-800',
            icon: <Check className="h-3 w-3" />,
            label: 'Résolu',
            border: 'border-green-200'
        },
        pending: {
            bg: 'bg-blue-100',
            text: 'text-blue-800',
            icon: <Clock className="h-3 w-3" />,
            label: 'En cours',
            border: 'border-blue-200'
        }
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
        <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}>
            {config.icon}
            <span className="ml-1.5">{config.label}</span>
        </span>
    );
};

// Composant StatCard pour les statistiques
const StatCard = ({ title, count, color, icon, bgColor }) => (
    <motion.div
        whileHover={{ scale: 1.02 }}
        className={`${bgColor} p-6 rounded-2xl border border-opacity-20 shadow-sm hover:shadow-md transition-all duration-200`}
    >
        <div className="flex items-center justify-between">
            <div>
                <p className={`text-sm font-medium ${color.replace('600', '800')}`}>{title}</p>
                <p className={`text-3xl font-bold ${color} mt-2`}>{count}</p>
            </div>
            <div className={`p-3 rounded-xl ${color.replace('600', '100')}`}>
                {icon}
            </div>
        </div>
    </motion.div>
);

// Composant AlertTable amélioré
const AlertTable = ({ alerts = [], loading }) => {
    const today = new Date();

    if (loading) {
        return (
            <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <div className="flex justify-center items-center h-32">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    >
                        <Loader2 className="h-8 w-8 text-[#00D09C]" />
                    </motion.div>
                </div>
            </div>
        );
    }

    if (!alerts.length) {
        return (
            <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                <div className="text-gray-400 mb-4">
                    <AlertTriangle className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune alerte</h3>
                <p className="text-gray-500">Tous vos domaines sont en bonne santé !</p>
            </div>
        );
    }

    return (
        <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        {['Nom de domaine', 'Type d\'alerte', 'Détails', 'Détecté le', 'Statut'].map((header) => (
                            <th
                                key={header}
                                scope="col"
                                className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                            >
                                {header}
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {alerts.map((alert, index) => {
                        const daysLeft = alert.type === 'expiring' && alert.domain_expiration
                            ? Math.ceil((new Date(alert.domain_expiration) - today) / (1000 * 60 * 60 * 24))
                            : alert.type === 'ssl' && alert.ssl_expiration
                                ? Math.ceil((new Date(alert.ssl_expiration) - today) / (1000 * 60 * 60 * 24))
                                : null;

                        const alertTypeLabels = {
                            offline: 'Hors ligne',
                            expiring: 'Expiration domaine',
                            ssl: 'SSL Expiré'
                        };

                        const detailLabels = {
                            offline: 'Domaine inaccessible',
                            expiring: daysLeft !== null ? `${daysLeft} jours restants` : 'Date inconnue',
                            ssl: daysLeft !== null ? `${daysLeft} jours avant expiration` : 'Date inconnue'
                        };

                        return (
                            <motion.tr
                                key={alert.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="hover:bg-gray-50 transition-colors duration-200"
                            >
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">
                                        {alert.domain || 'N/A'}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-600">
                                        {alertTypeLabels[alert.type] || 'Inconnu'}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-600">
                                        {detailLabels[alert.type] || 'N/A'}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-600">
                                        {alert.detected_at ? new Date(alert.detected_at).toLocaleDateString('fr-FR') : 'N/A'}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <StatusBadge status={alert.status} />
                                </td>
                            </motion.tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// Composant principal AlertManagement
// Composant principal AlertManagement
const AlertManagement = () => {
    const [domains, setDomains] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [alertTypeFilter, setAlertTypeFilter] = useState(null);
    const [refreshing, setRefreshing] = useState(false);


    const fetchDomains = async (showRefreshing = false) => {
        try {
            if (showRefreshing) setRefreshing(true);
            setLoading(!showRefreshing);

            const response = await axios.get('http://localhost:8000/api/domaines');
            setDomains(Array.isArray(response?.data) ? response.data : []);
            setError(null);
        } catch (err) {
            console.error("Erreur API:", err);
            setError('Erreur lors du chargement des domaines');
            setDomains([]);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchDomains();
        const interval = setInterval(() => fetchDomains(true), 300000);
        return () => clearInterval(interval);
    }, []);

    // Fonction pour déterminer les alertes
// Fonction pour déterminer les alertes
    const getDomainAlerts = (domain) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normaliser l'heure à minuit pour la comparaison
        const alerts = [];

        // Vérifier si le domaine est offline
        if (domain.en_ligne !== 1) {
            alerts.push({
                type: 'offline',
                message: 'Domaine inaccessible',
                detectedAt: domain.last_checked || new Date().toISOString()
            });
        }

        // Vérifier l'expiration du domaine
        if (domain.date_expiration) {
            try {
                const expDate = new Date(domain.date_expiration);
                expDate.setHours(0, 0, 0, 0); // Normaliser l'heure
                const daysLeft = Math.ceil((expDate - today) / (1000 * 60 * 60 * 24));

                if (daysLeft <= 30) {
                    alerts.push({
                        type: 'expiring',
                        message: daysLeft <= 0
                            ? 'Domaine expiré'
                            : `Expire dans ${daysLeft} jour${daysLeft > 1 ? 's' : ''}`,
                        detectedAt: domain.last_checked || new Date().toISOString()
                    });
                }
            } catch (e) {
                console.error('Erreur de date expiration:', domain.date_expiration, e);
            }
        }

        // Vérifier l'expiration SSL - Version corrigée
        if (domain.network_detail?.ssl_expiration) {
            try {
                const sslDate = new Date(domain.network_detail?.ssl_expiration);
                sslDate.setHours(0, 0, 0, 0); // Normaliser l'heure

                // Calculer la différence en jours
                const timeDiff = sslDate - today;
                const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

                // Si la date est dans le passé (SSL expiré) ou expire dans moins de 30 jours
                if (daysLeft <= 30) {
                    alerts.push({
                        type: 'ssl',
                        message: daysLeft <= 0
                            ? 'SSL expiré'
                            : `SSL expire dans ${daysLeft} jour${daysLeft > 1 ? 's' : ''}`,
                        detectedAt: domain.last_checked || new Date().toISOString()
                    });
                }
            } catch (e) {
                console.error('Erreur de date SSL:', domain.ssl_expiration, e);
            }
        }

        return alerts;
    };
    // Générer les alertes à afficher
    const generatedAlerts = domains.flatMap(domain => {
        const alerts = getDomainAlerts(domain);
        return alerts.map(alert => ({
            id: `${domain.id}-${alert.type}`,
            domain: domain.nom,
            type: alert.type,
            message: alert.message,
            detected_at: alert.detectedAt,
            status: 'pending' // Vous pouvez ajouter une logique pour les statuts résolus
        }));
    });

    // Filtrer les alertes
    const filteredAlerts = generatedAlerts.filter(alert => {
        const matchesSearch = searchTerm
            ? alert.domain?.toLowerCase().includes(searchTerm.toLowerCase())
            : true;
        const matchesType = alertTypeFilter ? alert.type === alertTypeFilter : true;
        return matchesSearch && matchesType;
    });

    // Compter les alertes par type
    const alertCounts = generatedAlerts.reduce((acc, alert) => {
        acc[alert.type] = (acc[alert.type] || 0) + 1;
        acc.total = (acc.total || 0) + 1;
        return acc;
    }, { offline: 0, expiring: 0, ssl: 0, total: 0 });

    const alertTypes = [
        { value: null, label: 'Tous les types' },
        { value: 'offline', label: 'Hors ligne' },
        { value: 'expiring', label: 'Expiration domaine' },
        { value: 'ssl', label: 'SSL Expiré' }
    ];

    if (error) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 border border-red-200 rounded-2xl p-6"
                >
                    <div className="flex items-center">
                        <X className="h-6 w-6 text-red-500 mr-3" />
                        <div>
                            <h3 className="text-lg font-medium text-red-800">Erreur de chargement</h3>
                            <p className="text-sm text-red-600 mt-1">{error}</p>
                        </div>
                        <button
                            onClick={() => fetchDomains()}
                            className="ml-auto px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                        >
                            Réessayer
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* En-tête avec animation */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Gestion des alertes</h1>
                        <p className="mt-2 text-gray-600">
                            Surveillez et gérez les alertes de vos domaines en temps réel
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Statistiques */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
            >
                <StatCard
                    title="Total Alertes"
                    count={alertCounts.total}
                    color="text-blue-600"
                    bgColor="bg-blue-50"
                    icon={<AlertTriangle className="h-6 w-6 text-blue-600" />}
                />
                <StatCard
                    title="Domaines Offline"
                    count={alertCounts.offline}
                    color="text-red-600"
                    bgColor="bg-red-50"
                    icon={<X className="h-6 w-6 text-red-600" />}
                />
                <StatCard
                    title="Expirations proches"
                    count={alertCounts.expiring}
                    color="text-yellow-600"
                    bgColor="bg-yellow-50"
                    icon={<AlertTriangle className="h-6 w-6 text-yellow-600" />}
                />
                <StatCard
                    title="SSL Expirés"
                    count={alertCounts.ssl}
                    color="text-purple-600"
                    bgColor="bg-purple-50"
                    icon={<AlertTriangle className="h-6 w-6 text-purple-600" />}
                />
            </motion.div>

            {/* Filtres */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8"
            >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <SearchInput
                        placeholder="Rechercher un domaine..."
                        value={searchTerm}
                        onChange={setSearchTerm}
                    />
                    <FilterDropdown
                        options={alertTypes}
                        selected={alertTypeFilter}
                        onSelect={setAlertTypeFilter}
                        label="Type d'alerte"
                        icon={<Filter className="h-4 w-4" />}
                    />
                </div>
            </motion.div>

            {/* Tableau des alertes */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <AlertTable alerts={filteredAlerts} loading={loading} />
            </motion.div>
        </div>
    );
};
// Composant principal Alerts avec layout corrigé
// Composant principal Alerts avec layout corrigé
const Alerts = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = () => {
        logout(); // supprime token
        navigate('/', { replace: true }); // redirige vers login

        // Bloque bouton retour
        window.history.pushState(null, '', window.location.href);
        window.onpopstate = () => {
            window.location.replace('/');
        };
    };
    return (
        <div className="fixed inset-0 overflow-auto bg-white font-[Inter,_Noto_Sans,sans-serif]">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col min-h-screen w-full"
            >
                {/* Header - maintenant full width */}
                <header className="bg-white shadow-sm border-b border-gray-200 w-full">
                    <div className="mx-auto px-4 sm:px-6 lg:px-8 w-full">
                        <div className="flex justify-between h-16 items-center w-full max-w-7xl mx-auto">
                            <ViaDominLogo/>

                            <nav className="hidden md:flex space-x-8">
                                {[
                                    {to: '/home', label: 'Dashboard'},
                                    {to: '/alerts', label: 'Alertes', active: true},
                                    {to: '/statistics', label: 'Statistiques'},
                                    {to: '/add-domaine', label: 'Ajouter un domaine'}
                                ].map((item) => (
                                    <Link
                                        key={item.to}
                                        to={item.to}
                                        className={`px-3 py-2 text-sm font-medium transition-colors ${
                                            item.active
                                                ? 'text-[#00D09C] border-b-2 border-[#00D09C]'
                                                : 'text-gray-500 hover:text-[#00D09C]'
                                        }`}
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                            </nav>

                            <div className="flex items-center">
                                <button
                                    className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#00D09C] transition-all duration-200"
                                    aria-label="Déconnexion"
                                    onClick={() => {
                                        handleLogout();
                                    }}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content - maintenant centré et full width */}
                <main className="flex-1 w-full">
                    <div className="w-full mx-auto">
                        <AlertManagement/>
                    </div>
                </main>
            </motion.div>
        </div>
    );
};
export default Alerts;