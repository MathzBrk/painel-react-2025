import { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  // Estados para armazenar dados e controle de UI
  const [personagens, setPersonagens] = useState([]);
  const [personagemSelecionado, setPersonagemSelecionado] = useState(null);
  const [exibirPrincipais, setExibirPrincipais] = useState(false);
  const [filtrarFolha, setFiltrarFolha] = useState(false);

  // Lista dos nomes para filtrar personagens principais
  const nomesPersonagensPrincipais = ['naruto', 'sasuke', 'kakashi', 'sakura', 'shikamaru', 'gaara'];

  // Carrega os personagens ao abrir ou quando desmarca personagem selecionado
  useEffect(() => {
    if (!personagemSelecionado) {
      axios.get(`https://naruto-br-api.site/characters`)
        .then(response => {
          const dadosPersonagens = response.data.map((dadosPersonagem) => ({
            id: dadosPersonagem.id,
            nome: dadosPersonagem.name,
            vila: dadosPersonagem.village.name,
            cargo: dadosPersonagem.rank,
            poder: dadosPersonagem.power,
            jutsuPrincipal: dadosPersonagem.jutsus?.[0]?.name || 'Jutsu desconhecido'
          }));
          setPersonagens(dadosPersonagens);
        })
        .catch(err => {
          console.error("Erro ao carregar personagens:", err);
        });
    }
  }, [personagemSelecionado]);

  // Seleciona personagem e busca detalhes dele
  const handleSelecionarPersonagem = (id) => {
    axios.get(`https://naruto-br-api.site/characters/${id}`)
      .then(response => {
        setPersonagemSelecionado({
          nome: response.data.name,
          imagem: response.data.profile_image,
          sumario: response.data.summary
        });
      })
      .catch(err => {
        console.error("Erro ao carregar personagem:", err);
      });
  };

  // Filtra personagens principais pelo nome
  const personagensPrincipaisFiltrados = personagens.filter((personagem) => {
    const primeiroNome = personagem.nome.split(' ').pop().toLowerCase();
    return nomesPersonagensPrincipais.includes(primeiroNome);
  });

  // Decide quais personagens mostrar (principais ou todos)
  const personagensParaExibir = exibirPrincipais ? personagensPrincipaisFiltrados : personagens;

  // Aplica filtro de vila da folha se ativado
  const personagensFiltrados = filtrarFolha
    ? personagensParaExibir.filter(p => p.vila.toLowerCase().includes("folha"))
    : personagensParaExibir;

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4 fw-bold">Personagens de Naruto</h1>

      {/* Lista de personagens */}
      {!personagemSelecionado && (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
          {/* Botões de filtro */}
          <div className="mb-4 d-flex flex-wrap justify-content-center gap-3 p-3">
            {exibirPrincipais ? (
              <button
                className="btn btn-secondary px-4 py-2"
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
              {filtrarFolha ? "Mostrar Todas as Vilas" : "Mostrar apenas Vila da Folha"}
            </button>
          </div>

          {personagensFiltrados.map((p) => (
            <div key={p.id} className="col">
              <div
                className="card h-100 shadow-sm cursor-pointer"
                role="button"
                onClick={() => handleSelecionarPersonagem(p.id)}
                title={`Ver detalhes de ${p.nome}`}
                style={{ transition: 'transform 0.2s ease-in-out' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{p.nome}</h5>
                  <p className="card-text mb-1"><strong>Vila:</strong> {p.vila}</p>
                  <p className="card-text mb-1"><strong>Melhor Jutsu:</strong> {p.jutsuPrincipal}</p>
                  <p className="card-text mb-1"><strong>Rank:</strong> {p.cargo}</p>
                  <p className="card-text mb-0"><strong>Poder:</strong> {p.poder}</p>
                  <div className="mt-auto">
                    <small className="text-muted">Clique para detalhes</small>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detalhes do personagem selecionado */}
      {personagemSelecionado && (
        <div className="card mx-auto my-4" style={{ maxWidth: '400px' }}>
          <img
            src={personagemSelecionado.imagem}
            className="card-img-top"
            alt={personagemSelecionado.nome}
            style={{ objectFit: 'cover', height: '300px' }}
          />
          <div className="card-body text-center">
            <h2 className="card-title">{personagemSelecionado.nome}</h2>
            <p className="card-text">{personagemSelecionado.sumario}</p>
            <button className="btn btn-secondary mt-3" onClick={() => setPersonagemSelecionado(null)}>Voltar</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
