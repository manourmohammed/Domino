import React, { useState, useEffect, useRef } from "react";
import {
    Globe,
    PieChart,
    Activity,
    CheckCircle,
    HelpCircle,
    Loader2,
    ChevronRight,
    Bell,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const API_URL = "http://localhost:8000/api";
// Animation configurations
const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
};

const slideUp = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const CMS_COLORS = {
    wordpress: "#21759b",
    joomla: "#f46f36",
    drupal: "#0678be",
    magento: "#f46f25",
    shopify: "#95bf47",
    squarespace: "#222222",
    ghost: "#738a94",
    prestashop: "#df0067",
    none: "#9e9e9e",
    inconnu: "#f60606",
    inaccessible: "#ffc107",
};
// Composant Logo ViaDomin's avec animation
const ViaDominLogo = () => (
    <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-2"
    >
        <Globe className="w-6 h-6 text-[#00D09C]" />
        <span className="text-xl font-bold bg-gradient-to-r from-[#00D09C] to-[#702FFF] bg-clip-text text-transparent">
      ViaDomin's
    </span>
    </motion.div>
);
// Composant StatCard animé
const StatCard = ({ title, value, change, icon, trend, delay = 0 }) => {
    const trendColors = {
        up: "text-green-600",
        down: "text-red-600",
        neutral: "text-gray-500",
    };

    const trendIcons = {
        up: "↑",
        down: "↓",
        neutral: "→",
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: delay * 0.1 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
        >
            <div className="flex justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500">{title}</p>
                    <motion.p
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: delay * 0.1 + 0.3 }}
                        className="text-2xl font-bold text-gray-900 mt-1"
                    >
                        {value}
                    </motion.p>
                    <p className={`text-xs mt-1 ${trendColors[trend]}`}>
                        {change} {trendIcons[trend]}
                    </p>
                </div>
                <motion.div
                    initial={{ rotate: -30 }}
                    animate={{ rotate: 0 }}
                    transition={{ delay: delay * 0.1 + 0.2 }}
                    className="h-10 w-10 rounded-lg bg-[#00D09C]/10 flex items-center justify-center"
                >
                    {icon}
                </motion.div>
            </div>
        </motion.div>
    );
};

const BarChartComponent = ({ domainsData }) => {
    const formatData = (data) => {
        if (!data || typeof data !== "object") return {};

        return Object.entries(data).reduce((acc, [key, value]) => {
            const count = Number(value);
            if (!isNaN(count)) {
                acc[key] = count;
            }
            return acc;
        }, {});
    };

    const formattedData = formatData(domainsData);
    const totalDomains = Object.values(formattedData).reduce(
        (sum, count) => sum + count,
        0
    );
    const [hoveredBar, setHoveredBar] = useState(null);

    if (totalDomains === 0) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow-sm border border-gray-200"
            >
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gray-100 mb-4">
                    <PieChart className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium">Aucune donnée disponible</p>
                <p className="text-sm text-gray-400 mt-1">
                    Ajoutez des domaines pour voir les statistiques
                </p>
            </motion.div>
        );
    }

    const segments = Object.entries(formattedData)
        .map(([cms, count]) => {
            const cmsKey = cms.toLowerCase();
            return {
                cms: cms || "Inconnu",
                count,
                percentage: Math.round((count / totalDomains) * 100),
                color: CMS_COLORS[cmsKey] || CMS_COLORS.inconnu,
            };
        })
        .sort((a, b) => b.count - a.count);

    const maxCount = Math.max(...segments.map((segment) => segment.count), 1);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
            <div className="p-5 border-b ">
                <h3 className="text-lg font-semibold text-gray-800">
                    Répartition par CMS
                </h3>
                <p className="text-sm text-gray-500">{totalDomains} domaines analysés</p>
            </div>

            <div className="p-6 border-b border-gray-200">
                <div className="h-80 w-full max-w-7xl mx-auto flex items-end gap-8 mb-8">
                    {segments.map((segment, index) => (
                        <motion.div
                            key={`bar-${segment.cms}-${index}`}
                            className="flex flex-col items-center flex-1"
                            initial={{height: 0}}
                            animate={{height: `${(segment.count / maxCount) * 100}%`}}
                            transition={{delay: index * 0.1, duration: 0.8}}
                        >
                            <motion.div
                                className="w-full rounded-t-sm relative"
                                style={{
                                    backgroundColor: segment.color,
                                    height: "100%",
                                }}
                                whileHover={{opacity: 0.8}}
                                onMouseEnter={() => setHoveredBar(segment)}
                                onMouseLeave={() => setHoveredBar(null)}
                            >
                                {hoveredBar?.cms === segment.cms && (
                                    <motion.div
                                        className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap"
                                        initial={{opacity: 0, y: 10}}
                                        animate={{opacity: 1, y: 0}}
                                    >
                                        {segment.count} ({segment.percentage}%)
                                    </motion.div>
                                )}
                            </motion.div>
                            <motion.p
                                className="text-xs text-gray-500 mt-2 text-center truncate w-full"
                                initial={{opacity: 0}}
                                animate={{opacity: 1}}
                                transition={{delay: index * 0.1 + 0.3}}
                            >
                                {segment.cms}
                            </motion.p>
                        </motion.div>
                    ))}
                </div>

                <div className="flex flex-wrap gap-2">
                    {segments.map((segment, index) => (
                        <motion.div
                            key={`legend-${segment.cms}-${index}`}
                            className="flex items-center px-2 py-1 rounded-md bg-gray-50"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: index * 0.1 + 0.5 }}
                            onMouseEnter={() => setHoveredBar(segment)}
                            onMouseLeave={() => setHoveredBar(null)}
                        >
                            <div
                                className="w-2 h-2 rounded-sm mr-2"
                                style={{ backgroundColor: segment.color }}
                            />
                            <span className="text-xs font-medium text-gray-800 truncate max-w-[80px]">
                {segment.cms}
              </span>
                            <span className="text-xs font-semibold text-gray-600 ml-1">
                {segment.percentage}%
              </span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

const DomainExpirationChart = ({ domains = [] }) => {
    const colors = {
        Expiré: "#FF2D55",
        "Moins de 30 jours": "#FF7A00",
        "Moins d'1 an": "#FFD600",
        "Plus d'1 an": "#00D09C",
    };

    const expirationData = domains.reduce(
        (acc, domain) => {
            if (!domain.date_expiration) return acc;

            const expiryDate = new Date(domain.date_expiration);
            if (isNaN(expiryDate.getTime())) return acc;

            const daysUntilExpiry = Math.floor(
                (expiryDate - new Date()) / (1000 * 60 * 60 * 24)
            );

            let status;
            if (daysUntilExpiry < 0) status = "Expiré";
            else if (daysUntilExpiry <= 30) status = "Moins de 30 jours";
            else if (daysUntilExpiry <= 365) status = "Moins d'1 an";
            else status = "Plus d'1 an";

            return { ...acc, [status]: (acc[status] || 0) + 1 };
        },
        {
            Expiré: 0,
            "Moins de 30 jours": 0,
            "Moins d'1 an": 0,
            "Plus d'1 an": 0,
        }
    );

    const totalDomains = domains.length;

    if (totalDomains === 0) {
        return (
            <motion.div variants={fadeIn} className="text-center py-8 text-gray-500">
                Aucun domaine à afficher
            </motion.div>
        );
    }

    return (
        <motion.div variants={fadeIn} className="mt-4">
            <motion.div
                className="grid grid-cols-4 gap-4 mb-6"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
            >
                {Object.entries(expirationData).map(([status, count], index) => (
                    <motion.div
                        key={status}
                        variants={slideUp}
                        className="text-center p-3 rounded-lg hover:bg-gray-50"
                    >
                        <motion.div
                            className="text-2xl font-bold"
                            style={{ color: colors[status] }}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            {count}
                        </motion.div>
                        <div className="text-xs text-gray-500 mt-1">{status}</div>
                    </motion.div>
                ))}
            </motion.div>

            <motion.div
                className="w-full bg-gray-200 rounded-full h-4 mt-6 flex overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
            >
                {Object.entries(expirationData).map(([status, count], index) => (
                    <motion.div
                        key={status}
                        className="h-4"
                        style={{ backgroundColor: colors[status] }}
                        initial={{ width: 0 }}
                        animate={{ width: `${(count / totalDomains) * 100}%` }}
                        transition={{ delay: 0.2 + index * 0.1, duration: 0.8 }}
                    />
                ))}
            </motion.div>

            <motion.div
                className="flex justify-center mt-4 flex-wrap gap-4"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
            >
                {Object.keys(colors).map((status) => (
                    <motion.div
                        key={status}
                        variants={slideUp}
                        className="flex items-center px-3 py-1 rounded-full bg-gray-50"
                    >
                        <div
                            className="w-3 h-3 rounded-full mr-2"
                            style={{ backgroundColor: colors[status] }}
                        />
                        <span className="text-sm text-gray-700">{status}</span>
                    </motion.div>
                ))}
            </motion.div>
        </motion.div>
    );
};

const Statistics = () => {
    const [data, setData] = useState({
        loading: true,
        error: null,
        stats: {
            totalDomains: 0,
            wordpressCount: 0,
            avgAvailability: 0,
            avgResponseTime: 0,
        },
        cmsDistribution: {},
        domains: [],
    });
    const [chartLoading, setChartLoading] = useState(true);
    const statsRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) throw new Error("Non authentifié");

                const headers = {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                };

                const [domainsRes, cmsRes] = await Promise.all([
                    fetch(`${API_URL}/domaines`, { headers }),
                    fetch(`${API_URL}/domaines/cms-stats`, { headers }),
                ]);

                if (!domainsRes.ok) throw new Error("Erreur chargement domaines");
                if (!cmsRes.ok) throw new Error("Erreur chargement stats CMS");

                const [domainsData, cmsData] = await Promise.all([
                    domainsRes.json(),
                    cmsRes.json(),
                ]);

                const avgAvailability =
                    domainsData.length > 0
                        ? parseFloat(
                            (
                                domainsData.reduce((sum, domain) => {
                                    return sum + (domain.status === 200 ? 100 : 0);
                                }, 0) / domainsData.length
                            ).toFixed(2)
                        )
                        : 0;

                const avgResponseTime =
                    domainsData.length > 0
                        ? parseFloat(
                            (
                                domainsData.reduce(
                                    (sum, domain) => sum + (domain.network_detail?.ping || 0),
                                    0
                                ) / domainsData.length
                            ).toFixed(2)
                        )
                        : 0;

                setData({
                    loading: false,
                    stats: {
                        totalDomains: domainsData.length,
                        wordpressCount: cmsData.wordpressCount || 0,
                        avgAvailability,
                        avgResponseTime,
                    },
                    cmsDistribution: cmsData.cmsDistribution || {},
                    domains: domainsData,
                    error: null,
                });
                setChartLoading(false);
            } catch (err) {
                console.error("Fetch error:", err);
                setData((prev) => ({
                    ...prev,
                    loading: false,
                    error: err.message,
                }));
                setChartLoading(false);
            }
        };

        fetchData();
    }, []);
    return (
        <div className="fixed inset-0 overflow-auto bg-white font-[Inter,_Noto_Sans,sans-serif]">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col min-h-screen w-full">
                {/* Header */}
                <header className="bg-white shadow-sm border-b border-gray-200 w-full">
                    <div className="mx-auto px-4 sm:px-6 lg:px-8 w-full">
                        <div className="flex justify-between h-16 items-center w-full max-w-7xl mx-auto">
                            <ViaDominLogo />

                            <nav className="hidden md:flex space-x-8">
                                {[
                                    { to: "/home", label: "Dashboard" },
                                    { to: "/alerts", label: "Alertes" },
                                    { to: "/statistics", label: "Statistiques", active: true },
                                    { to: "/add-domaine", label: "Ajouter un domaine" },
                                ].map((item) => (
                                    <Link
                                        key={item.to}
                                        to={item.to}
                                        className={`px-3 py-2 text-sm font-medium transition-colors ${
                                            item.active
                                                ? "text-[#00D09C] border-b-2 border-[#00D09C]"
                                                : "text-gray-500 hover:text-[#00D09C]"
                                        }`}
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                            </nav>

                            <div className="flex items-center">
                                <button className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#00D09C] transition-all duration-200">
                                    <Bell className="h-6 w-6" />
                                </button>
                            </div>
                        </div>
                    </div>
                </header>
                <main ref={statsRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Titre */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8">
                        <h1 className="text-2xl font-bold text-gray-900">Statistiques de surveillance</h1>
                        <p className="mt-2 text-sm text-gray-600">
                            Aperçu visuel des domaines surveillés et de leur statut
                        </p>
                    </motion.div>
                    {/* Cartes stats */}
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
                    >
                        {[
                            {
                                title: "Domaines surveillés",
                                value: data.stats.totalDomains,
                                change: "+10% ce mois",
                                icon: <Globe className="text-[#00D09C]" />,
                                trend: "up",
                            },
                            {
                                title: "WordPress détectés",
                                value: data.stats.wordpressCount,
                                change: "+5% ce mois",
                                icon: <PieChart className="text-[#702FFF]" />,
                                trend: "up",
                            },
                            {
                                title: "Disponibilité moyenne",
                                value: `${data.stats.avgAvailability.toPrecision(2)}%`,
                                change: "Stable",
                                icon: <CheckCircle className="text-green-600" />,
                                trend: "neutral",
                            },
                            {
                                title: "Temps réponse moyen",
                                value: `${data.stats.avgResponseTime.toPrecision(2)}ms`,
                                change: "-12% ce mois",
                                icon: <Activity className="text-gray-900" />,
                                trend: "up",
                            },
                        ].map((stat, index) => (
                            <motion.div key={stat.title} variants={slideUp}>
                                <StatCard {...stat} delay={index} />
                            </motion.div>
                        ))}
                    </motion.div>
                    {/* Section principale modifiée */}
                    <div className="space-y-6 mb-8">
                        {/* CMS - Pleine largeur */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
                            whileHover={{ y: -5 }}>
                            {chartLoading ? (
                                <div className="flex justify-center items-center h-64">
                                    <Loader2 className="animate-spin text-[#00D09C] w-8 h-8" />
                                </div>
                            ) : (
                                <BarChartComponent domainsData={data.cmsDistribution} />
                            )}
                        </motion.div>
                        {/* Grille pour expiration et détails */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Expiration */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
                                whileHover={{ y: -5 }}
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-medium text-gray-900">Expiration des domaines</h2>

                                </div>
                                <DomainExpirationChart domains={data.domains} />
                            </motion.div>
                            {/* Détails */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
                                whileHover={{ y: -5 }}
                            >
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Répartition détaillée</h3>
                                <div className="space-y-3">
                                    {Object.entries(data.cmsDistribution)
                                        .filter(([, count]) => count > 0)
                                        .sort((a, b) => b[1] - a[1])
                                        .map(([cms, count], index) => (
                                            <motion.div
                                                key={cms}
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.7 + index * 0.1 }}
                                                className="w-full"
                                            >
                                                <div className="flex items-center justify-between text-sm mb-1">
                                                    <div className="flex items-center">
                                                        <span className="text-gray-500 mr-2">{index + 1}.</span>
                                                        <span className="text-gray-700">{cms || "Inconnu"}</span>
                                                    </div>
                                                    <span className="font-medium text-gray-900">
                          {count} ({Math.round((count / data.stats.totalDomains) * 100)}%)
                        </span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                    <motion.div
                                                        className="bg-blue-600 h-2.5 rounded-full"
                                                        initial={{ width: 0 }}
                                                        animate={{
                                                            width: `${(count / data.stats.totalDomains) * 100}%`,
                                                        }}
                                                        transition={{
                                                            delay: 0.8 + index * 0.1,
                                                            duration: 0.8,
                                                        }}
                                                    />
                                                </div>
                                            </motion.div>
                                        ))}
                                </div>
                            </motion.div>
                        </div>
                    </div>
                    {/* Guide */}
                    <motion.div
                        className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9 }}
                        whileHover={{ scale: 1.005 }}
                    >
                        <div className="flex items-center mb-4">
                            <motion.div
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                            >
                                <HelpCircle className="h-5 w-5 text-[#702FFF] mr-2" />
                            </motion.div>
                            <h2 className="text-lg font-medium text-gray-900">Guide d'interprétation</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-md font-medium text-gray-800 mb-2">Comprendre les graphiques</h3>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    {[
                                        "Graphique CMS: Répartition des technologies utilisées (WordPress, Joomla...)",
                                        "Expiration: Domaines classés par date d'expiration",
                                        "Couleurs: Indiquent l'urgence (rouge = expiré, vert = OK)",
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-start">
                                            <ChevronRight className="text-[#00D09C] mr-2 w-4 h-4" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-md font-medium text-gray-800 mb-2">Actions recommandées</h3>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    {[
                                        "Renouvelez les domaines expirant sous 30 jours",
                                        "Vérifiez les sites avec temps de réponse élevé",
                                        "Mettez à jour les CMS vulnérables",
                                        "Contactez les propriétaires des sites expirés",
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-start">
                                            <ChevronRight className="text-[#702FFF] mr-2 w-4 h-4" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </motion.div>
                </main>
            </motion.div>
        </div>
    );
};
export default Statistics;