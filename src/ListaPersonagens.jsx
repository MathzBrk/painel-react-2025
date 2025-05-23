
function ListaPersonagens({ personagens, exibirPrincipais, setExibirPrincipais, filtrarFolha, setFiltrarFolha,
    filtrarAreia, setFiltrarAreia, filtrarNevoa, setFiltrarNevoa,
    handleSelecionarPersonagem
}) {
    return (
        <>
            <div className="d-flex flex-wrap justify-content-center gap-3 mb-4">
                {exibirPrincipais ? (
                    <button
                        className="btn btn-outline-primary px-4 py-2"
                        onClick={() => setExibirPrincipais(false)}
                    >
                        Mostrar Todos
                    </button>
                ) : (
                    <button
                        className="btn btn-primary px-4 py-2"
                        onClick={() => setExibirPrincipais(true)}
                    >
                        Mostrar Personagens Principais
                    </button>
                )}

                <button
                    className={`btn px-4 py-2 ${filtrarFolha ? 'btn-outline-success' : 'btn-success'}`}
                    onClick={() => setFiltrarFolha(!filtrarFolha)}
                >
                    Mostrar apenas Vila da Folha
                </button>

                <button
                    className={`btn px-4 py-2 ${filtrarAreia ? 'btn-outline-success' : 'btn-success'}`}
                    onClick={() => setFiltrarAreia(!filtrarAreia)}
                >
                    Mostrar apenas Vila da Areia
                </button>

                <button
                    className={`btn px-4 py-2 ${filtrarNevoa ? 'btn-outline-success' : 'btn-success'}`}
                    onClick={() => setFiltrarNevoa(!filtrarNevoa)}
                >
                    Mostrar apenas Vila da Nevoa
                </button>
            </div>

            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
                {personagens.map((p, index) => (
                    <div key={p.id} className="col">
                        <div
                            className={`bg-dark-subtle h-100 shadow-sm border ${index % 4 === 0 ? 'border-primary' : index % 4 === 1 ? 'border-success' : index % 4 === 2 ? 'border-danger' : 'border-warning'} border-2`}
                            role="button"
                            onClick={() => handleSelecionarPersonagem(p.id)}
                            title={`Ver detalhes de ${p.nome}`}
                            style={{ cursor: 'pointer', transition: 'transform 0.2s ease-in-out' }}
                            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            <div className="card-body d-flex flex-column">
                                <h5 className="card-title">{p.nome}</h5>
                                <p className="card-text mb-1"><strong>Vila:</strong> {p.vila}</p>
                                <p className="card-text mb-1"><strong>Melhor Jutsu:</strong> {p.jutsuPrincipal}</p>
                                <p className="card-text mb-1"><strong>Rank:</strong> {p.cargo}</p>
                                <p className="card-text mb-2"><strong>Poder:</strong> {p.poder}</p>
                                <div className="mt-auto text-end">
                                    <small className="text-muted fst-italic">Clique para detalhes</small>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}

export default ListaPersonagens;
