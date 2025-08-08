import React, { useState, useEffect } from 'react';
import {
    Globe, Shield, Search, Zap, Github, Chrome, CheckCircle,
    ArrowRight, Users, Database, Lock, LogIn, X, BarChart2,
    Clock, Server, Code, ShieldCheck, Globe2, Layers, Terminal,
    Mail, MessageSquare, Phone
} from 'lucide-react';

const Login = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [currentFeature, setCurrentFeature] = useState(0);
    const [showLogin, setShowLogin] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        setIsVisible(true);
        const interval = setInterval(() => {
            setCurrentFeature((prev) => (prev + 1) % features.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [isVisible]);

    const handleLogin = (e) => {
        e.preventDefault();
        const trimmedUser = username.trim();
        const trimmedPass = password.trim();

        if (trimmedUser === 'admin' && trimmedPass === 'admin') {
            setIsLoggedIn(true);
            setShowLogin(false);
            setUsername('');
            setPassword('');
        } else {
            alert('Identifiants incorrects');
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:8000/api/Auth/redirect';
    };

    const handleGitHubLogin = () => {
        window.location.href = "http://localhost:8000/api/Auth/github/redirect";
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

    if (isLoggedIn) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#00D09C] to-[#702FFF] text-white">
                <div className="container mx-auto px-6 py-12">
                    <header className="flex justify-between items-center mb-16">
                        <div className="flex items-center space-x-2">
                            <Globe className="w-8 h-8" />
                            <span className="text-2xl font-bold">ViaDomin's Pro</span>
                        </div>
                        <button
                            onClick={() => setIsLoggedIn(false)}
                            className="px-6 py-2 rounded-lg bg-white text-[#060014] font-medium hover:bg-opacity-90 transition"
                        >
                            Déconnexion
                        </button>
                    </header>

                    <div className="text-center max-w-4xl mx-auto">
                        <div className="inline-flex items-center px-4 py-2 rounded-full bg-white bg-opacity-10 mb-8">
                            <Zap className="w-4 h-4 mr-2" />
                            <span>Tableau de bord professionnel</span>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            Bienvenue dans votre espace
                        </h1>

                        <p className="text-xl opacity-90 mb-12">
                            Accédez à toutes les fonctionnalités avancées d'analyse de domaine et configurez vos préférences.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                            <div className="bg-white bg-opacity-10 p-6 rounded-xl backdrop-blur-sm border border-white border-opacity-20">
                                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-white bg-opacity-20 mb-4">
                                    <Globe2 className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Nouvelle analyse</h3>
                                <p className="opacity-80">Lancez une analyse complète d'un domaine</p>
                            </div>
                            <div className="bg-white bg-opacity-10 p-6 rounded-xl backdrop-blur-sm border border-white border-opacity-20">
                                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-white bg-opacity-20 mb-4">
                                    <Layers className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Historique</h3>
                                <p className="opacity-80">Consultez vos analyses précédentes</p>
                            </div>
                            <div className="bg-white bg-opacity-10 p-6 rounded-xl backdrop-blur-sm border border-white border-opacity-20">
                                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-white bg-opacity-20 mb-4">
                                    <Code className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">API</h3>
                                <p className="opacity-80">Générez vos clés API</p>
                            </div>
                        </div>

                        <button className="px-8 py-3 rounded-lg bg-white text-[#060014] font-semibold hover:bg-opacity-90 transition flex items-center mx-auto">
                            Commencer une analyse
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white text-gray-900 antialiased">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white bg-opacity-90 backdrop-blur-sm border-b border-gray-100">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Globe className="w-8 h-8 text-[#00D09C]" />
                            <span className="text-2xl font-bold bg-gradient-to-r from-[#00D09C] to-[#702FFF] bg-clip-text text-transparent">
                                ViaDomin's
                            </span>
                        </div>

                        <div className="hidden md:flex items-center space-x-8">
                            <a href="#features" className="text-gray-600 hover:text-[#00D09C] transition">Fonctionnalités</a>
                            <a href="#contact" className="text-gray-600 hover:text-[#00D09C] transition">Contact</a>
                            <button
                                onClick={() => setShowLogin(true)}
                                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-[#060014] text-white hover:bg-opacity-90 transition"
                            >
                                <LogIn className="w-4 h-4" />
                                <span>Connexion</span>
                            </button>
                        </div>

                        <button
                            className="md:hidden p-2"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {isMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>

                    {/* Mobile menu */}
                    {isMenuOpen && (
                        <div className="md:hidden mt-4 pb-4 space-y-4">
                            <a href="#features" className="block text-gray-600 hover:text-[#00D09C] transition">Fonctionnalités</a>
                            <a href="#contact" className="block text-gray-600 hover:text-[#00D09C] transition">Contact</a>
                            <button
                                onClick={() => setShowLogin(true)}
                                className="w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg bg-[#060014] text-white hover:bg-opacity-90 transition"
                            >
                                <LogIn className="w-4 h-4" />
                                <span>Connexion</span>
                            </button>
                        </div>
                    )}
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#00D09C]/10 to-[#702FFF]/10"></div>
                    <div className="absolute top-20 left-20 w-72 h-72 rounded-full bg-[#702FFF]/10 blur-3xl"></div>
                    <div className="absolute bottom-40 right-20 w-72 h-72 rounded-full bg-[#00D09C]/10 blur-3xl"></div>
                </div>

                <div className="container mx-auto px-6 py-24 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#702FFF]/10 text-[#702FFF] mb-8">
                            <Zap className="w-4 h-4 mr-2" />
                            <span>Un domaine sûr, un futur assuré.</span>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#060014] via-[#00D09C] to-[#702FFF]">
                                Analyse de domaine
                            </span>
                            <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#702FFF] to-[#00D09C]">
                                professionnelle
                            </span>
                        </h1>

                        <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
                            Solution complète pour analyser, surveiller et sécuriser vos noms de domaine avec des outils puissants et une API intuitive.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                            <button
                                onClick={handleGitHubLogin}
                                className="flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-[#060014] text-white font-semibold hover:bg-opacity-90 transition"
                            >
                                <Github className="w-5 h-5" />
                                S'inscrire avec GitHub
                                <ArrowRight className="w-4 h-4" />
                            </button>

                            <button
                                onClick={handleGoogleLogin}
                                className="flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-[#00D09C] text-white font-semibold hover:bg-opacity-90 transition"
                            >
                                <Chrome className="w-5 h-5" />
                                S'inscrire avec Google
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="max-w-2xl mx-auto mb-20">
                            <div className="relative group">
                                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#00D09C] to-[#702FFF] opacity-20 blur-md group-hover:opacity-30 transition"></div>
                                <div className="relative bg-white/80 backdrop-blur-sm rounded-xl p-2 border border-gray-200">
                                    <div className="flex items-center">
                                        <Search className="w-5 h-5 ml-4 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Entrez un domaine pour l'analyser (ex: google.com)"
                                            className="flex-1 bg-transparent px-4 py-3 focus:outline-none text-gray-900 placeholder-gray-400"
                                        />
                                        <button className="px-6 py-3 rounded-lg bg-gradient-to-r from-[#00D09C] to-[#702FFF] text-white font-semibold hover:opacity-90 transition">
                                            Analyser
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
                            {stats.map((stat, index) => (
                                <div key={index} className="text-center">
                                    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-r from-[#00D09C] to-[#702FFF] text-white mx-auto mb-4">
                                        {stat.icon}
                                    </div>
                                    <div className="text-3xl font-bold mb-2 text-[#060014]">{stat.value}</div>
                                    <div className="text-gray-600">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 bg-gray-50">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#060014]">
                            Solutions professionnelles
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Des outils avancés pour gérer et sécuriser vos actifs numériques
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className={`bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all ${
                                    currentFeature === index ? 'ring-2 ring-[#702FFF]/50' : ''
                                }`}
                            >
                                <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-r from-[#702FFF] to-[#00D09C] text-white mb-6">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-semibold mb-4 text-[#060014]">{feature.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                                <div className="flex items-center mt-6 text-[#702FFF]">
                                    <span className="text-sm font-medium">En savoir plus</span>
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-[#00D09C] to-[#702FFF] text-white">
                <div className="container mx-auto px-6 text-center">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">
                            Prêt à optimiser vos domaines ?
                        </h2>
                        <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
                            Rejoignez des milliers de professionnels qui font confiance à ViaDomin's pour leurs analyses.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={() => setShowLogin(true)}
                                className="px-8 py-4 rounded-xl bg-white text-[#060014] font-semibold hover:bg-opacity-90 transition flex items-center justify-center gap-2 mx-auto"
                            >
                                <CheckCircle className="w-5 h-5" />
                                Commencer gratuitement
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#060014]">
                                Contactez notre équipe
                            </h2>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                Nous sommes là pour répondre à vos questions
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="bg-gray-50 rounded-xl p-8 shadow-sm border border-gray-100">
                                <h3 className="text-xl font-semibold mb-6 text-[#060014]">Informations de contact</h3>

                                <div className="space-y-6">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-lg bg-[#00D09C]/10 text-[#00D09C] mr-4">
                                            <Mail className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-600 mb-1">Email</h4>
                                            <p className="text-[#060014]">contact@viadomins.com</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-lg bg-[#702FFF]/10 text-[#702FFF] mr-4">
                                            <MessageSquare className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-600 mb-1">Support</h4>
                                            <p className="text-[#060014]">support@viadomins.com</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-lg bg-[#060014]/10 text-[#060014] mr-4">
                                            <Phone className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-600 mb-1">Téléphone</h4>
                                            <p className="text-[#060014]">+33 1 23 45 67 89</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-8 shadow-sm border border-gray-100">
                                <h3 className="text-xl font-semibold mb-6 text-[#060014]">Envoyez-nous un message</h3>
                                <form className="space-y-6">
                                    <div>
                                        <label className="block mb-2 font-medium text-gray-700">Nom</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00D09C] focus:border-transparent"
                                            placeholder="Votre nom"
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-2 font-medium text-gray-700">Email</label>
                                        <input
                                            type="email"
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00D09C] focus:border-transparent"
                                            placeholder="votre@email.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-2 font-medium text-gray-700">Message</label>
                                        <textarea
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00D09C] focus:border-transparent min-h-[150px]"
                                            placeholder="Votre message"
                                        ></textarea>
                                    </div>
                                    <button
                                        type="submit"
                                        className="px-8 py-3 rounded-lg bg-gradient-to-r from-[#00D09C] to-[#702FFF] text-white font-semibold hover:opacity-90 transition"
                                    >
                                        Envoyer le message
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 bg-[#060014] text-white">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                        <div>
                            <div className="flex items-center space-x-2 mb-4">
                                <Globe className="w-6 h-6 text-[#00D09C]" />
                                <span className="text-xl font-bold">ViaDomin's</span>
                            </div>
                            <p className="text-gray-400">
                                Solution professionnelle d'analyse de domaine pour les entreprises et développeurs.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Produit</h3>
                            <ul className="space-y-2">
                                <li><a href="#features" className="text-gray-400 hover:text-white transition">Fonctionnalités</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition">API</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition">Documentation</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Entreprise</h3>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-gray-400 hover:text-white transition">À propos</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition">Blog</a></li>
                                <li><a href="#contact" className="text-gray-400 hover:text-white transition">Contact</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Légal</h3>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-gray-400 hover:text-white transition">Confidentialité</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition">CGU</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
                        <p>© 2024 ViaDomin's. Tous droits réservés.</p>
                    </div>
                </div>
            </footer>

            {/* Login Modal */}
            {showLogin && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
                    <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden">
                        <button
                            onClick={() => setShowLogin(false)}
                            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="p-8">
                            <div className="text-center mb-8">
                                <div className="flex items-center justify-center mb-4">
                                    <Globe className="w-10 h-10 text-[#00D09C]" />
                                </div>
                                <h2 className="text-2xl font-bold text-[#060014] mb-2">
                                    Connectez-vous
                                </h2>
                                <p className="text-gray-600">
                                    Accédez à votre espace professionnel
                                </p>
                            </div>

                            <form onSubmit={handleLogin} className="space-y-6">
                                <div>
                                    <label className="block mb-2 font-medium text-gray-700">Email ou nom d'utilisateur</label>
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00D09C] focus:border-transparent"
                                        placeholder="admin"
                                    />
                                </div>

                                <div>
                                    <label className="block mb-2 font-medium text-gray-700">Mot de passe</label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00D09C] focus:border-transparent"
                                        placeholder="••••••••"
                                        onKeyPress={(e) => e.key === 'Enter' && handleLogin(e)}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-[#00D09C] to-[#702FFF] text-white font-semibold hover:opacity-90 transition"
                                >
                                    Se connecter
                                </button>

                                <div className="text-center">
                                    <a href="#" className="text-sm text-[#702FFF] hover:underline">
                                        Mot de passe oublié ?
                                    </a>
                                </div>

                                <div className="relative flex items-center py-4">
                                    <div className="flex-grow border-t border-gray-300"></div>
                                    <span className="flex-shrink mx-4 text-gray-400">ou</span>
                                    <div className="flex-grow border-t border-gray-300"></div>
                                </div>

                                <div className="space-y-4">
                                    <button
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
                                    </button>

                                    <button
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
                                    </button>
                                </div>
                            </form>

                            <div className="text-center mt-8 text-sm text-gray-500">
                                Pas encore de compte ?{' '}
                                <button
                                    onClick={() => setShowLogin(true)}
                                    className="text-[#702FFF] hover:underline font-medium"
                                >
                                    S'inscrire
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Login;