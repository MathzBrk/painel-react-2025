import React from 'react';

function DetalhePersonagem({ personagem, onClick }) {
    return (
        <div className="mx-auto my-4 border border-primary border-3 rounded-3" style={{ maxWidth: '800px' }}>
            <div className="row g-0 bg-dark-subtle">
                <div className="col-12 col-md-5 d-flex align-items-center justify-content-center p-3">
                    <img
                        src={personagem.imagem}
                        alt={personagem.nome}
                        className="img-fluid rounded"
                        style={{
                            objectFit: 'contain',
                            maxHeight: '350px',
                            width: '100%'
                        }}
                    />
                </div>
                <div className="col-12 col-md-7 d-flex flex-column">
                    <div className="card-body bg-dark-subtle">
                        <h2 className="card-title text-center text-md-start">{personagem.nome}</h2>
                        <p className="card-text mt-3 p-2" style={{ textAlign: 'justify' }}>
                            {personagem.sumario}
                        </p>
                    </div>
                    <div className="card-footer bg-transparent border-0 mt-auto text-center">
                        <button
                            className="btn btn-secondary align-self-center border-2 m-2"
                            onClick={onClick}
                        >
                            Voltar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DetalhePersonagem;
