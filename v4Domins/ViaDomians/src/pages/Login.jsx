import React, { useState, useEffect } from 'react';
import {
    Globe, Shield, Search, Zap, Github, Chrome, CheckCircle,
    ArrowRight, Users, Database, Lock, LogIn, X, BarChart2,
    Clock, Server, Code, ShieldCheck, Globe2, Layers, Terminal,
    Mail, MessageSquare, Phone
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; // Import des composants d'animation

const Login = () => {
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState(false);
    const [currentFeature, setCurrentFeature] = useState(0);
    const [showLogin, setShowLogin] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        setIsVisible(true);
        const interval = setInterval(() => {
            setCurrentFeature((prev) => (prev + 1) % features.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [isVisible]);

    const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:8000/api/Auth/redirect';
    };

    const handleGitHubLogin = () => {
        window.location.href = "http://localhost:8000/api/Auth/github/redirect";
    };

    // Fonction pour gérer le retour OAuth
    useEffect(() => {
        // Vérifie si l'URL contient le token après OAuth
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');

        if (token) {
            localStorage.setItem('token', token);  // stocke le token
            navigate('/home', { replace: true });  // redirige vers /home
        }
    }, [navigate]);

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.3 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: 'spring', stiffness: 100 }
        }
    };

    const featureVariants = {
        hidden: { scale: 0.95, opacity: 0 },
        visible: {
            scale: 1,
            opacity: 1,
            transition: { type: 'spring', stiffness: 100 }
        }
    };

    const features = [
        {
            icon: <Search className="w-8 h-8" />,
            title: "Analyse Complète",
            description: "Vérifiez la disponibilité, l'historique WHOIS, les DNS, et les détails techniques de n'importe quel domaine en temps réel."
        },
        {
            icon: <ShieldCheck className="w-8 h-8" />,
            title: "Sécurité Avancée",
            description: "Détection des menaces, vérification des certificats SSL, analyse de réputation et protection contre le phishing."
        },
        {
            icon: <BarChart2 className="w-8 h-8" />,
            title: "Performances",
            description: "Analyse des temps de réponse, disponibilité et performances globales de votre domaine."
        },
        {
            icon: <Terminal className="w-8 h-8" />,
            title: "API Puissante",
            description: "Intégrez nos services directement dans vos applications avec notre API RESTful documentée."
        }
    ];

    const stats = [
        { icon: <Users className="w-6 h-6" />, value: "50K+", label: "Clients professionnels" },
        { icon: <Database className="w-6 h-6" />, value: "1M+", label: "Requêtes quotidiennes" },
        { icon: <Server className="w-6 h-6" />, value: "99.99%", label: "Disponibilité" },
        { icon: <Clock className="w-6 h-6" />, value: "<500ms", label: "Temps de réponse" }
    ];

    return (
        <div className="min-h-screen bg-white text-gray-900 antialiased">
            {/* Header avec fond sombre */}
            <motion.header
                initial={{y: -100, opacity: 0}}
                animate={{y: 0, opacity: 1}}
                transition={{
                    type: 'spring',
                    stiffness: 100,
                    damping: 10
                }}
                className="sticky top-0 z-50 bg-[#00D09C]/10  backdrop-blur-md border-b border-[#702FFF]/10">
                <div className="container mx-auto px-6 py-3">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <motion.div
                            initial={{x: -20, opacity: 0}}
                            animate={{x: 0, opacity: 1}}
                            transition={{
                                delay: 0.2,
                                type: 'spring',
                                stiffness: 100
                            }}
                            className="flex items-center space-x-2 cursor-pointer"
                            onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
                        >
                            <motion.div
                                whileHover={{rotate: 15, scale: 1.1}}
                                whileTap={{scale: 0.9}}
                            >
                                <Globe className="w-8 h-8 text-[#00D09C]"/>
                            </motion.div>
                            <span
                                className="text-2xl font-bold bg-gradient-to-r from-[#00D09C] to-[#702FFF] bg-clip-text text-transparent">
                        ViaDomin's
                    </span>
                        </motion.div>

                        {/* Navigation desktop */}
                        <div className="hidden md:flex items-center space-x-6">
                            <motion.a
                                whileHover={{
                                    scale: 1.05,
                                    color: "#00D09C",
                                    textShadow: "0 2px 8px rgba(0, 208, 156, 0.3)"
                                }}
                                whileTap={{scale: 0.95}}
                                href="#features"
                                className="text-gray-500 hover:text-[#00D09C] transition-colors font-medium px-3 py-1 rounded-lg "
                            >
                                Fonctionnalités
                            </motion.a>

                            <motion.a
                                whileHover={{
                                    scale: 1.05,
                                    color: "#702FFF",
                                    textShadow: "0 2px 8px rgba(112, 47, 255, 0.3)"
                                }}
                                whileTap={{scale: 0.95}}
                                href="#contact"
                                className="text-gray-500 hover:text-[#702FFF] transition-colors font-medium px-3 py-1 rounded-lg"
                            >
                                Contact
                            </motion.a>

                            <motion.button
                                whileHover={{
                                    scale: 1.05,
                                    background: "linear-gradient(135deg, #00D09C 0%, #702FFF 100%)",
                                    boxShadow: "0 4px 14px rgba(112, 47, 255, 0.5)"
                                }}
                                whileTap={{
                                    scale: 0.95,
                                    background: "linear-gradient(135deg, #00B887 0%, #5A1FE0 100%)"
                                }}
                                onClick={() => setShowLogin(true)}
                                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#00D09C] to-[#702FFF] text-white font-medium transition-all"
                            >
                                <LogIn className="w-4 h-4"/>
                                <span>Connexion</span>
                            </motion.button>
                        </div>

                        {/* Bouton menu mobile */}
                        <motion.button
                            whileHover={{scale: 1.1, rotate: 90}}
                            whileTap={{scale: 0.9}}
                            className="md:hidden p-2 rounded-lg bg-[#702FFF]/20 hover:bg-[#702FFF]/30 transition"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            aria-label="Menu"
                        >
                            <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor"
                                 viewBox="0 0 24 24">
                                {isMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M6 18L18 6M6 6l12 12"/>
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M4 6h16M4 12h16M4 18h16"/>
                                )}
                            </svg>
                        </motion.button>
                    </div>

                    {/* Menu mobile */}
                    <AnimatePresence>
                        {isMenuOpen && (
                            <motion.div
                                initial={{
                                    height: 0,
                                    opacity: 0,
                                    y: -20
                                }}
                                animate={{
                                    height: "auto",
                                    opacity: 1,
                                    y: 0
                                }}
                                exit={{
                                    height: 0,
                                    opacity: 0,
                                    y: -20
                                }}
                                transition={{
                                    type: "spring",
                                    stiffness: 200,
                                    damping: 20
                                }}
                                className="md:hidden overflow-hidden bg-[#060014]/95 backdrop-blur-sm"
                            >
                                <div className="pt-4 pb-6 space-y-4">
                                    <motion.a
                                        whileHover={{x: 5, color: "#00D09C"}}
                                        href="#features"
                                        className="block text-gray-300 hover:text-[#00D09C] transition pl-2 py-2 border-l-4 border-transparent hover:border-[#00D09C]"
                                    >
                                        Fonctionnalités
                                    </motion.a>

                                    <motion.a
                                        whileHover={{x: 5, color: "#702FFF"}}
                                        href="#contact"
                                        className="block text-gray-300 hover:text-[#702FFF] transition pl-2 py-2 border-l-4 border-transparent hover:border-[#702FFF]"
                                    >
                                        Contact
                                    </motion.a>

                                    <motion.button
                                        whileHover={{scale: 1.02}}
                                        whileTap={{scale: 0.98}}
                                        onClick={() => setShowLogin(true)}
                                        className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg bg-gradient-to-r from-[#00D09C] to-[#702FFF] text-white font-medium mt-2"
                                    >
                                        <LogIn className="w-4 h-4"/>
                                        <span>Connexion</span>
                                    </motion.button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.header>

            {/* Hero Section */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div
                        className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#00D09C]/10 to-[#702FFF]/10"></div>
                    <motion.div
                        animate={{
                            x: [0, 100, 0],
                            y: [0, 50, 0],
                            rotate: [0, 10, 0]
                        }}
                        transition={{
                            duration: 20,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                        className="absolute top-20 left-20 w-72 h-72 rounded-full bg-[#702FFF]/10 blur-3xl"
                    ></motion.div>
                    <motion.div
                        animate={{
                            x: [0, -100, 0],
                            y: [0, -50, 0],
                            rotate: [0, -10, 0]
                        }}
                        transition={{
                            duration: 25,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                        className="absolute bottom-40 right-20 w-72 h-72 rounded-full bg-[#00D09C]/10 blur-3xl"
                    ></motion.div>
                </div>

                <div className="container mx-auto px-6 py-24 relative z-10">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={containerVariants}
                        className="max-w-4xl mx-auto text-center"
                    >
                        <motion.div
                            variants={itemVariants}
                            className="inline-flex items-center px-4 py-2 rounded-full bg-[#702FFF]/10 text-[#702FFF] mb-8"
                        >
                            <Zap className="w-4 h-4 mr-2"/>
                            <span>Un domaine sûr, un futur assuré.</span>
                        </motion.div>

                        <motion.h1
                            variants={itemVariants}
                            className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
                        >
                            <span
                                className="text-transparent bg-clip-text bg-gradient-to-r from-[#060014] via-[#00D09C] to-[#702FFF]">
                                Analyse de domaine
                            </span>
                            <br/>
                            <span
                                className="text-transparent bg-clip-text bg-gradient-to-r from-[#702FFF] to-[#00D09C]">
                                professionnelle
                            </span>
                        </motion.h1>

                        <motion.p
                            variants={itemVariants}
                            className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed"
                        >
                            Solution complète pour analyser, surveiller et sécuriser vos noms de domaine avec des outils
                            puissants et une API intuitive.
                        </motion.p>

                        <motion.div
                            variants={itemVariants}
                            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
                        >
                            <motion.button
                                whileHover={{scale: 1.03}}
                                whileTap={{scale: 0.97}}
                                onClick={handleGitHubLogin}
                                className="flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-[#060014] text-white font-semibold hover:bg-opacity-90 transition"
                            >
                                <Github className="w-5 h-5"/>
                                S'inscrire avec GitHub
                                <ArrowRight className="w-4 h-4"/>
                            </motion.button>

                            <motion.button
                                whileHover={{scale: 1.03}}
                                whileTap={{scale: 0.97}}
                                onClick={handleGoogleLogin}
                                className="flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-[#00D09C] text-white font-semibold hover:bg-opacity-90 transition"
                            >
                                <Chrome className="w-5 h-5"/>
                                S'inscrire avec Google
                                <ArrowRight className="w-4 h-4"/>
                            </motion.button>
                        </motion.div>

                        <motion.div
                            variants={itemVariants}
                            className="max-w-2xl mx-auto mb-20"
                        >
                            <div className="relative group">
                                <motion.div
                                    whileHover={{opacity: 0.3}}
                                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#00D09C] to-[#702FFF] opacity-20 blur-md group-hover:opacity-30 transition"
                                ></motion.div>
                                <div
                                    className="relative bg-white/80 backdrop-blur-sm rounded-xl p-2 border border-gray-200">
                                    <div className="flex items-center">
                                        <Search className="w-5 h-5 ml-4 text-gray-400"/>
                                        <input
                                            type="text"
                                            placeholder="Entrez un domaine pour l'analyser (ex: google.com)"
                                            className="flex-1 bg-transparent px-4 py-3 focus:outline-none text-gray-900 placeholder-gray-400"
                                        />
                                        <motion.button
                                            whileHover={{scale: 1.05}}
                                            whileTap={{scale: 0.95}}
                                            onClick={() => setShowLogin(true)}
                                            className="px-6 py-3 rounded-lg bg-gradient-to-r from-[#00D09C] to-[#702FFF] text-white font-semibold hover:opacity-90 transition"
                                        >
                                            Analyser
                                        </motion.button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            variants={containerVariants}
                            className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20"
                        >
                            {stats.map((stat, index) => (
                                <motion.div
                                    key={index}
                                    variants={itemVariants}
                                    className="text-center"
                                >
                                    <motion.div
                                        whileHover={{rotate: 10, scale: 1.1}}
                                        className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-r from-[#00D09C] to-[#702FFF] text-white mx-auto mb-4"
                                    >
                                        {stat.icon}
                                    </motion.div>
                                    <div className="text-3xl font-bold mb-2 text-[#060014]">{stat.value}</div>
                                    <div className="text-gray-600">{stat.label}</div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 bg-gray-50">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{opacity: 0, y: 20}}
                        whileInView={{opacity: 1, y: 0}}
                        viewport={{once: true}}
                        transition={{duration: 0.5}}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#060014]">
                            Solutions professionnelles
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Des outils avancés pour gérer et sécuriser vos actifs numériques
                        </p>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{once: true}}
                        variants={containerVariants}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                    >
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                variants={featureVariants}
                                whileHover={{y: -5}}
                                className={`bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all ${
                                    currentFeature === index ? 'ring-2 ring-[#702FFF]/50' : ''
                                }`}
                            >
                                <motion.div
                                    whileHover={{rotate: 5, scale: 1.1}}
                                    className="flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-r from-[#702FFF] to-[#00D09C] text-white mb-6"
                                >
                                    {feature.icon}
                                </motion.div>
                                <h3 className="text-xl font-semibold mb-4 text-[#060014]">{feature.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                                <motion.div
                                    whileHover={{x: 5}}
                                    className="flex items-center mt-6 text-[#702FFF]"
                                >
                                </motion.div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* CTA Section */}
            <motion.section
                initial={{opacity: 0}}
                whileInView={{opacity: 1}}
                viewport={{once: true}}
                transition={{duration: 0.5}}
                className="py-20 bg-gradient-to-r from-[#00D09C] to-[#702FFF] text-white"
            >
                <div className="container mx-auto px-6 text-center">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">
                            Prêt à optimiser vos domaines ?
                        </h2>
                        <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
                            Rejoignez des milliers de professionnels qui font confiance à ViaDomin's pour leurs
                            analyses.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <motion.button
                                whileHover={{scale: 1.05}}
                                whileTap={{scale: 0.95}}
                                onClick={() => setShowLogin(true)}
                                className="px-8 py-4 rounded-xl bg-white text-[#060014] font-semibold hover:bg-opacity-90 transition flex items-center justify-center gap-2 mx-auto"
                            >
                                <CheckCircle className="w-5 h-5"/>
                                Commencer gratuitement
                                <ArrowRight className="w-4 h-4"/>
                            </motion.button>
                        </div>
                    </div>
                </div>
            </motion.section>

            {/* Contact Section */}
            <section id="contact" className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{opacity: 0, y: 20}}
                        whileInView={{opacity: 1, y: 0}}
                        viewport={{once: true}}
                        transition={{duration: 0.5}}
                        className="max-w-4xl mx-auto"
                    >
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#060014]">
                                Contactez notre équipe
                            </h2>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                Nous sommes là pour répondre à vos questions
                            </p>
                        </div>

                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{once: true}}
                            variants={containerVariants}
                            className="grid grid-cols-1 md:grid-cols-2 gap-12"
                        >
                            <motion.div
                                variants={itemVariants}
                                className="bg-gray-50 rounded-xl p-8 shadow-sm border border-gray-100"
                            >
                                <h3 className="text-xl font-semibold mb-6 text-[#060014]">Informations de contact</h3>

                                <div className="space-y-6">
                                    <motion.div
                                        whileHover={{x: 5}}
                                        className="flex items-start"
                                    >
                                        <div
                                            className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-lg bg-[#00D09C]/10 text-[#00D09C] mr-4">
                                            <Mail className="w-5 h-5"/>
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-600 mb-1">Email</h4>
                                            <p className="text-[#060014]">contact@viadomins.com</p>
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        whileHover={{x: 5}}
                                        className="flex items-start"
                                    >
                                        <div
                                            className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-lg bg-[#702FFF]/10 text-[#702FFF] mr-4">
                                            <MessageSquare className="w-5 h-5"/>
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-600 mb-1">Support</h4>
                                            <p className="text-[#060014]">support@viadomins.com</p>
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        whileHover={{x: 5}}
                                        className="flex items-start"
                                    >
                                        <div
                                            className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-lg bg-[#060014]/10 text-[#060014] mr-4">
                                            <Phone className="w-5 h-5"/>
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-600 mb-1">Téléphone</h4>
                                            <p className="text-[#060014]">+33 1 23 45 67 89</p>
                                        </div>
                                    </motion.div>
                                </div>
                            </motion.div>

                            <motion.div
                                variants={itemVariants}
                                className="bg-gray-50 rounded-xl p-8 shadow-sm border border-gray-100"
                            >
                                <h3 className="text-xl font-semibold mb-6 text-[#060014]">Envoyez-nous un message</h3>
                                <form className="space-y-6">
                                    <motion.div
                                        whileHover={{scale: 1.01}}
                                    >
                                        <label className="block mb-2 font-medium text-gray-700">Nom</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00D09C] focus:border-transparent"
                                            placeholder="Votre nom"
                                        />
                                    </motion.div>
                                    <motion.div
                                        whileHover={{scale: 1.01}}
                                    >
                                        <label className="block mb-2 font-medium text-gray-700">Email</label>
                                        <input
                                            type="email"
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00D09C] focus:border-transparent"
                                            placeholder="votre@email.com"
                                        />
                                    </motion.div>
                                    <motion.div
                                        whileHover={{scale: 1.01}}
                                    >
                                        <label className="block mb-2 font-medium text-gray-700">Message</label>
                                        <textarea
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00D09C] focus:border-transparent min-h-[150px]"
                                            placeholder="Votre message"
                                        ></textarea>
                                    </motion.div>
                                    <motion.button
                                        whileHover={{scale: 1.03}}
                                        whileTap={{scale: 0.97}}
                                        type="submit"
                                        className="px-8 py-3 rounded-lg bg-gradient-to-r from-[#00D09C] to-[#702FFF] text-white font-semibold hover:opacity-90 transition"
                                    >
                                        Envoyer le message
                                    </motion.button>
                                </form>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <motion.footer
                initial={{opacity: 0}}
                whileInView={{opacity: 1}}
                viewport={{once: true}}
                className="py-12 bg-[#060014] text-white"
            >
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                        <motion.div
                            whileHover={{y: -5}}
                        >
                            <div className="flex items-center space-x-2 mb-4">
                                <Globe className="w-6 h-6 text-[#00D09C]"/>
                                <span className="text-xl font-bold">ViaDomin's</span>
                            </div>
                            <p className="text-gray-400">
                                Solution professionnelle d'analyse de domaine pour les entreprises et développeurs.
                            </p>
                        </motion.div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Produit</h3>
                            <ul className="space-y-2">
                                <li>
                                    <motion.a
                                        whileHover={{x: 5, color: "#00D09C"}}
                                        href="#features"
                                        className="text-gray-400 hover:text-white transition"
                                    >
                                        Fonctionnalités
                                    </motion.a>
                                </li>
                                <li>
                                    <motion.a
                                        whileHover={{x: 5, color: "#00D09C"}}
                                        href="#"
                                        className="text-gray-400 hover:text-white transition"
                                    >
                                        API
                                    </motion.a>
                                </li>
                                <li>
                                    <motion.a
                                        whileHover={{x: 5, color: "#00D09C"}}
                                        href="#"
                                        className="text-gray-400 hover:text-white transition"
                                    >
                                        Documentation
                                    </motion.a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Entreprise</h3>
                            <ul className="space-y-2">
                                <li>
                                    <motion.a
                                        whileHover={{x: 5, color: "#00D09C"}}
                                        href="#"
                                        className="text-gray-400 hover:text-white transition"
                                    >
                                        À propos
                                    </motion.a>
                                </li>
                                <li>
                                    <motion.a
                                        whileHover={{x: 5, color: "#00D09C"}}
                                        href="#"
                                        className="text-gray-400 hover:text-white transition"
                                    >
                                        Blog
                                    </motion.a>
                                </li>
                                <li>
                                    <motion.a
                                        whileHover={{x: 5, color: "#00D09C"}}
                                        href="#contact"
                                        className="text-gray-400 hover:text-white transition"
                                    >
                                        Contact
                                    </motion.a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Légal</h3>
                            <ul className="space-y-2">
                                <li>
                                    <motion.a
                                        whileHover={{x: 5, color: "#00D09C"}}
                                        href="#"
                                        className="text-gray-400 hover:text-white transition"
                                    >
                                        Confidentialité
                                    </motion.a>
                                </li>
                                <li>
                                    <motion.a
                                        whileHover={{x: 5, color: "#00D09C"}}
                                        href="#"
                                        className="text-gray-400 hover:text-white transition"
                                    >
                                        CGU
                                    </motion.a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
                        <p>© 2024 ViaDomin's. Tous droits réservés.</p>
                    </div>
                </div>
            </motion.footer>

            {/* Login Modal */}
            <AnimatePresence>
                {showLogin && (
                    <motion.div
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0}}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{scale: 0.9, opacity: 0}}
                            animate={{scale: 1, opacity: 1}}
                            exit={{scale: 0.9, opacity: 0}}
                            className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden"
                        >
                            <motion.button
                                whileHover={{scale: 1.1}}
                                whileTap={{scale: 0.9}}
                                onClick={() => setShowLogin(false)}
                                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition"
                            >
                                <X className="w-5 h-5"/>
                            </motion.button>

                            <div className="p-8">
                                <motion.div
                                    initial={{opacity: 0, y: -20}}
                                    animate={{opacity: 1, y: 0}}
                                    transition={{delay: 0.2}}
                                    className="text-center mb-8"
                                >
                                    <div className="flex items-center justify-center mb-4">
                                        <Globe className="w-10 h-10 text-[#00D09C]"/>
                                    </div>
                                    <h2 className="text-2xl font-bold text-[#060014] mb-2">
                                        Connectez-vous
                                    </h2>
                                    <p className="text-gray-600">
                                        Accédez à votre espace professionnel
                                    </p>
                                </motion.div>

                                <form className="space-y-6">
                                    <motion.div
                                        initial={{opacity: 0}}
                                        animate={{opacity: 1}}
                                        transition={{delay: 0.3}}
                                        className="space-y-4"
                                    >
                                        <motion.button
                                            whileHover={{scale: 1.02}}
                                            whileTap={{scale: 0.98}}
                                            type="button"
                                            onClick={handleGoogleLogin}
                                            className="w-full flex items-center justify-center gap-3 px-6 py-3 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-50 transition"
                                        >
                                            <img
                                                src="https://www.svgrepo.com/show/475656/google-color.svg"
                                                alt="Google"
                                                className="w-5 h-5"
                                            />
                                            Continuer avec Google
                                        </motion.button>

                                        <motion.button
                                            whileHover={{scale: 1.02}}
                                            whileTap={{scale: 0.98}}
                                            type="button"
                                            onClick={handleGitHubLogin}
                                            className="w-full flex items-center justify-center gap-3 px-6 py-3 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-50 transition"
                                        >
                                            <img
                                                src="https://www.svgrepo.com/show/512317/github-142.svg"
                                                alt="GitHub"
                                                className="w-5 h-5"
                                            />
                                            Continuer avec GitHub
                                        </motion.button>
                                    </motion.div>
                                </form>

                                <motion.div
                                    initial={{opacity: 0}}
                                    animate={{opacity: 1}}
                                    transition={{delay: 0.4}}
                                    className="text-center mt-8 text-sm text-gray-500"
                                >
                                    Pas encore de compte ?{' '}
                                    <span>
                                        S'inscrire avec Google ou github
                                    </span>
                                </motion.div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Login;