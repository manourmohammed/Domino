    import React, { useState } from 'react';
    import { Link } from 'react-router-dom';
    import {Globe, Plus, Check, X, Bell} from 'lucide-react';
    import apiClient from "../api/axios";
    import {motion} from "framer-motion";
    import { useNavigate } from 'react-router-dom';
    import { useAuth } from '../AuthContext';


    // Composant Logo ViaDomin's
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

    const AddDomaines = () => {
        const [domaines, setDomaines] = useState('');
        const [isLoading, setIsLoading] = useState(false);
        const [success, setSuccess] = useState(false);
        const [error, setError] = useState(null);
        const [addedDomains, setAddedDomains] = useState([]);
        const navigate = useNavigate();
        const { logout } = useAuth();

        const handleAddDomains = async () => {
            const list = domaines
                .split('\n')
                .map(d => d.trim())
                .filter(d => d.length > 0);

            if (list.length === 0) {
                setError("Veuillez entrer au moins un domaine");
                return;
            }

            setIsLoading(true);
            setError(null);
            setSuccess(false);

            try {
                // Appel API Laravel
                const res = await apiClient.post("/domaines/store-full", { domains: list });

                // Si Laravel renvoie bien les résultats
                if (res.data && res.data.results) {
                    setAddedDomains(res.data.results.map(r => r.id)); // ou selon ton champ
                    setDomaines('');
                    setSuccess(true);

                    // Masquer le message après 3 secondes
                    setTimeout(() => setSuccess(false), 3000);
                } else {
                    setError("Réponse inattendue du serveur");
                }

            } catch (err) {
                setError(err.response?.data?.message || "Erreur lors de l’ajout des domaines");
            } finally {
                setIsLoading(false);
            }
        };

        const handleClear = () => {
            setDomaines('');
            setError(null);
            setSuccess(false);
        };
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
            <div
                className="flex flex-col min-h-screen bg-white font-[Inter,_Noto_Sans,sans-serif]"
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    width: '100vw',
                    height: '100vh',
                    overflow: 'auto'
                }}
            >

                <div className="min-h-screen bg-gray-50">
                    {/* Header */}
                    <header className="bg-white shadow-sm border-b border-gray-200 w-full">
                        <div className="mx-auto px-4 sm:px-6 lg:px-8 w-full">
                            <div className="flex justify-between h-16 items-center w-full max-w-7xl mx-auto">
                                <ViaDominLogo/>

                                <nav className="hidden md:flex space-x-8">
                                    {[
                                        {to: "/home", label: "Dashboard"},
                                        {to: "/alerts", label: "Alertes"},
                                        {to: "/statistics", label: "Statistiques"},
                                        {to: "/add-domaine", label: "Ajouter un domaine", active: true},
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

                    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="bg-white shadow rounded-lg p-6">
                            <div className="mb-8">
                                <h1 className="text-2xl font-bold text-gray-900">Ajouter des domaines</h1>
                                <p className="mt-2 text-sm text-gray-600">
                                    Entrez les domaines que vous souhaitez surveiller, un par ligne. Vous pouvez ajouter
                                    plusieurs domaines à la fois.
                                </p>
                            </div>

                            <div className="space-y-6">
                                {/* Zone de texte */}
                                <div>
                                    <label htmlFor="domains" className="block text-sm font-medium text-gray-700 mb-1">
                                        Domaines à surveiller
                                    </label>
                                    <textarea
                                        id="domains"
                                        rows={8}
                                        className="shadow-sm focus:ring-[#00D09C] focus:border-[#00D09C] block w-full sm:text-sm border border-gray-300 rounded-md p-4"
                                        placeholder="exemple.com&#10;nautre-site.org&#10;mon-site.fr"
                                        value={domaines}
                                        onChange={(e) => setDomaines(e.target.value)}
                                    />
                                    <p className="mt-2 text-sm text-gray-500">
                                        Séparez chaque domaine par un retour à la ligne
                                    </p>
                                </div>

                                {/* Boutons d'action */}
                                <div className="flex items-center justify-between">
                                    <div className="flex space-x-3">
                                        <button
                                            type="button"
                                            onClick={handleClear}
                                            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00D09C]"
                                        >
                                            <X className="-ml-1 mr-2 h-5 w-5 text-gray-500"/>
                                            Effacer
                                        </button>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleAddDomains}
                                        disabled={isLoading}
                                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-[#00D09C] to-[#702FFF] hover:from-[#00D09C]/90 hover:to-[#702FFF]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00D09C] disabled:opacity-50"
                                    >
                                        {isLoading ? (
                                            'En cours...'
                                        ) : (
                                            <>
                                                <Plus className="-ml-1 mr-3 h-5 w-5"/>
                                                Ajouter les domaines
                                            </>
                                        )}
                                    </button>
                                </div>

                                {/* Messages d'état */}
                                {error && (
                                    <div className="rounded-md bg-red-50 p-4">
                                        <div className="flex">
                                            <div className="flex-shrink-0">
                                                <X className="h-5 w-5 text-red-400"/>
                                            </div>
                                            <div className="ml-3">
                                                <h3 className="text-sm font-medium text-red-800">{error}</h3>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {success && (
                                    <div className="rounded-md bg-green-50 p-4">
                                        <div className="flex">
                                            <div className="flex-shrink-0">
                                                <Check className="h-5 w-5 text-green-400"/>
                                            </div>
                                            <div className="ml-3">
                                                <h3 className="text-sm font-medium text-green-800">
                                                    {addedDomains.length} domaine(s) ajouté(s) avec succès!
                                                </h3>
                                                <div className="mt-2 text-sm text-green-700">
                                                    <ul className="list-disc pl-5 space-y-1">
                                                        {addedDomains.slice(0, 5).map((domain, index) => (
                                                            <li key={index}>{domain}</li>
                                                        ))}
                                                        {addedDomains.length > 5 && (
                                                            <li>et {addedDomains.length - 5} autres...</li>
                                                        )}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Section d'aide */}
                        <div className="mt-8 bg-white shadow rounded-lg p-6">
                            <h2 className="text-lg font-medium text-gray-900 mb-4">Comment ajouter des domaines</h2>
                            <div className="prose prose-sm text-gray-500">
                                <ol className="list-decimal pl-5 space-y-2">
                                    <li>Entrez un domaine par ligne dans la zone de texte ci-dessus</li>
                                    <li>Les formats acceptés sont :<br/>- exemple.com<br/>- www.exemple.com<br/>- sous.domaine.exemple.com</li>
                                    <li>Cliquez sur "Ajouter les domaines" pour lancer la surveillance</li>
                                    <li>Les domaines seront vérifiés et ajoutés à votre tableau de bord</li>
                                </ol>
                                <p className="mt-4">
                                    <strong>Note :</strong> La vérification initiale peut prendre quelques minutes.
                                </p>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        );
    };

    export default AddDomaines;