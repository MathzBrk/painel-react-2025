import { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';

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
    <div className="container mx-auto py-4 text-center">
      <h1 className="text-center mb-4 fw-bold">Personagens de Naruto</h1>

      {/* Filtros e botões */}
      {!personagemSelecionado && (
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
              {filtrarFolha ? "Mostrar Todas as Vilas" : "Mostrar apenas Vila da Folha"}
            </button>
          </div>

          {/* Grid de cards responsiva */}
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
            {personagensFiltrados.map((p, index) => (
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
      )}

      {/* Detalhes do personagem selecionado */}
      {personagemSelecionado && (
        <div className="mx-auto my-4 border border-primary border-3 rounded-3" style={{ maxWidth: '800px' }}>
          {/* Em telas pequenas, empilha verticalmente; em telas médias+, lado a lado */}
          <div className="row g-0 bg-dark-subtle">
            {/* Contêiner da imagem - ocupa toda largura em telas pequenas, 5/12 em médias */}
            <div className="col-12 col-md-5 d-flex align-items-center justify-content-center p-3">
              <img
                src={personagemSelecionado.imagem}
                alt={personagemSelecionado.nome}
                className="img-fluid rounded"
                style={{
                  objectFit: 'contain',
                  maxHeight: '350px',
                  width: '100%'
                }}
              />
            </div>
            {/* Contêiner do conteúdo - ocupa toda largura em telas pequenas, 7/12 em médias */}
            <div className="col-12 col-md-7 d-flex flex-column">
              <div className="card-body bg-dark-subtle">
                <h2 className="card-title text-center text-md-start">{personagemSelecionado.nome}</h2>
                <p className="card-text mt-3 p-2" style={{ textAlign: 'justify' }}>
                  {personagemSelecionado.sumario}
                </p>
              </div>
              <div className="card-footer bg-transparent border-0 mt-auto text-center">
                <button
                  className="btn btn-secondary align-self-center border-2 m-2"
                  onClick={() => setPersonagemSelecionado(null)}
                >
                  Voltar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

}

export default App;
