import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Globe, Plus, Check, X, } from 'lucide-react';
import apiClient from '../api/axios'

// Composant Logo ViaDomin's
const ViaDominLogo = () => (
    <div className="flex items-center gap-2">
        <Globe className="w-6 h-6 text-[#00D09C]" />
        <span className="text-xl font-bold bg-gradient-to-r from-[#00D09C] to-[#702FFF] bg-clip-text text-transparent">
            ViaDomin's
        </span>
    </div>
);

const AddDomaines = () => {
    const [domaines, setDomaines] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);
    const [addedDomains, setAddedDomains] = useState([]);

    const handleAddDomains = async () => {
        const list = domaines
            .split('\n')
            .map(d => d.trim())
            .filter(d => d.length > 0);

        if (list.length === 0) {
            setError('Veuillez entrer au moins un domaine valide');
            return;
        }

        setIsLoading(true);
        setError(null);

        // Simulation d'une requête API
        setAddedDomains(list);
        setDomaines('');
        setSuccess(true);
        setIsLoading(false);

        console.log("sending list ", list);
        
        await apiClient.post("/domains", {
            domains: list
        })
    }

    const handleClear = () => {
        setDomaines('');
        setError(null);
        setSuccess(false);
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
                <header className="sticky top-0 z-10 bg-white shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16 items-center">
                            <div className="flex items-center">
                                <ViaDominLogo />
                            </div>
                            <nav className="hidden md:flex space-x-8">
                                <Link
                                    to="/home"
                                    className="text-gray-500 hover:text-[#00D09C] px-3 py-2 text-sm font-medium transition-colors"
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    to="/alerts"
                                    className="text-gray-500 hover:text-[#00D09C] px-3 py-2 text-sm font-medium transition-colors"
                                >
                                    Alertes
                                </Link>
                                <Link
                                    to="/statistics"
                                    className="text-gray-500 hover:text-[#00D09C] px-3 py-2 text-sm font-medium transition-colors"
                                >
                                    Statistiques
                                </Link>
                                <Link
                                    to="/add-domaine"
                                    className="text-[#00D09C] border-b-2 border-[#00D09C] px-3 py-2 text-sm font-medium"
                                >
                                    Ajouter un domaine
                                </Link>
                            </nav>
                            <div className="hidden md:block">
                                <div className="ml-4 flex items-center md:ml-6">
                                    {/* Bouton utilisateur ou autres éléments */}
                                </div>
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
                                    placeholder="exemple.com\nautre-site.org\nmon-site.fr"
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
                                        <X className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
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
                                            <Plus className="-ml-1 mr-3 h-5 w-5" />
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
                                            <X className="h-5 w-5 text-red-400" />
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
                                            <Check className="h-5 w-5 text-green-400" />
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
                                <li>Les formats acceptés sont : exemple.com, www.exemple.com, sous.domaine.exemple.com
                                </li>
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