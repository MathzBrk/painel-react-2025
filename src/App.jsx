import { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import ListaPersonagens from './ListaPersonagens';
import DetalhePersonagem from './DetalhePersonagem';

function App() {
  // Estados para armazenar dados e controle de UI
  const [personagens, setPersonagens] = useState([]);
  const [personagemSelecionado, setPersonagemSelecionado] = useState(null);
  const [exibirPrincipais, setExibirPrincipais] = useState(false);
  const [filtrarFolha, setFiltrarFolha] = useState(false);
  const [filtrarAreia, setFiltrarAreia] = useState(false);
  const [filtrarNevoa, setFiltrarNevoa] = useState(false);



  // Lista dos nomes para filtrar personagens principais
  const nomesPersonagensPrincipais = ['naruto', 'sasuke', 'kakashi', 'sakura', 'shikamaru', 'gaara', 'madara', 'nagato'];

  // Carrega os personagens ao abrir ou quando desmarca personagem selecionado
  useEffect(() => {
    if (!personagemSelecionado) {
      axios.get(`https://naruto-br-api.site/characters`)
        .then(response => {

          // Mapeamento dos dados da api para os dados que eu quero para os meus personagens
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
  }, [personagemSelecionado]); // Personagem Selecionado é o Estado que eu estou observando

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

  // Personagens filtrados pela vila
  const personagensDaFolha = personagens.filter((p) => p.vila.toLowerCase().includes("folha"));
  const personagensDaAreia = personagens.filter((p) => p.vila.toLowerCase().includes("areia"));
  const personagensDaNevoa = personagens.filter((p) => p.vila.toLowerCase().includes("névoa"));

  let personagensFiltrados = [];

  switch (true) {
    case filtrarFolha:
      personagensFiltrados = personagensDaFolha;
      break;
    case filtrarAreia:
      personagensFiltrados = personagensDaAreia;
      break;
    case filtrarNevoa:
      personagensFiltrados = personagensDaNevoa;
      break;
    default:
      personagensFiltrados = personagensParaExibir;
  }


  return (
    <div className="container mx-auto py-4 text-center">
      <h1 className="text-center mb-4 fw-bold">Personagens de Naruto</h1>

      {/* Botão de Mostrar Todos e resetar filtros */}
      <button
        className="btn btn-secondary mb-3"
        onClick={() => {
          setExibirPrincipais(false);
          setFiltrarFolha(false);
          setFiltrarAreia(false);
          setFiltrarNevoa(false);
        }}
      >
        Mostrar Todos
      </button>

      {!personagemSelecionado && (
        <ListaPersonagens
          personagens={personagensFiltrados}
          exibirPrincipais={exibirPrincipais}
          setExibirPrincipais={setExibirPrincipais}
          filtrarFolha={filtrarFolha}
          setFiltrarFolha={setFiltrarFolha}
          handleSelecionarPersonagem={handleSelecionarPersonagem}
          filtrarAreia={filtrarAreia}
          setFiltrarAreia={setFiltrarAreia}
          filtrarNevoa={filtrarNevoa}
          setFiltrarNevoa={setFiltrarNevoa}
        />
      )}

      {personagemSelecionado && (
        <DetalhePersonagem
          personagem={personagemSelecionado}
          onClick={() => setPersonagemSelecionado(null)}
        />
      )}
    </div>
  );

}

export default App;
