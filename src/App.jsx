import { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'

function App() {

  const [personagens, setPersonagens] = useState([]);
  const [personagemSelecionado, setPersonagemSelecionado] = useState(null);
  const [exibirPrincipais, setExibirPrincipais] = useState(false);

  const nomesPersonagensPrincipais = ['naruto', 'sasuke', 'kakashi', 'sakura', 'shikamaru'];


  useEffect(() => {
    if (!personagemSelecionado) {
      axios.get(`https://naruto-br-api.site/characters`)
        .then(response => {
          console.log(response)

          const dadosPersonagens = response.data.map((dadosPersonagem) => ({
            id: dadosPersonagem.id,
            nome: dadosPersonagem.name,
            vila: dadosPersonagem.village.name,
            cargo: dadosPersonagem.rank,
            poder: dadosPersonagem.power,
            jutsuPrincipal: dadosPersonagem.jutsus?.[0]?.name || 'Jutsu desconhecido'
          }))

          setPersonagens(dadosPersonagens);
          console.log(dadosPersonagens)
        })
    }
  }, [personagemSelecionado])

  const handleSelecionarPersonagem = (id) => {
    axios.get(`https://naruto-br-api.site/characters/${id}`)
      .then(response => {
        console.log(response)
        setPersonagemSelecionado({
          nome: response.data.name,
          imagem: response.data.profile_image,
          sumario: response.data.summary
        });
      });
  };

  const personagensPrincipaisFiltrados = personagens.filter((personagem) => {
    const primeiroNome = personagem.nome.split(' ').pop().toLowerCase();
    return nomesPersonagensPrincipais.includes(primeiroNome)
  })
  console.log(personagensPrincipaisFiltrados)


  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Personagens de Naruto</h1>

      <button className="btn btn-primary" onClick={() => setExibirPrincipais(true)}>Mostrar Personagens Principais</button>
      <button className="btn btn-secondary ms-2" onClick={() => setExibirPrincipais(false)}>Mostrar Todos</button>

      {/* Lista de Personagens */}
      {!personagemSelecionado && (
        <div className="d-flex flex-row flex-nowrap gap-4 justify-content-start" style={{ overflowX: 'auto' }}>
          {(exibirPrincipais ? personagensPrincipaisFiltrados : personagens).map((p) => (
            <div
              key={p.id}
              className="p-3"
              onClick={() => handleSelecionarPersonagem(p.id)}
              style={{
                cursor: 'pointer',
                border: '1px solid #ddd',
                borderRadius: '8px',
                minWidth: '250px',
                maxWidth: '250px'
              }}
            >
              <h5>{p.nome}</h5>
              <p><strong>Vila:</strong> {p.vila}</p>
              <p><strong>Melhor Jutsu:</strong> {p.jutsuPrincipal}</p>
              <p><strong>Rank:</strong> {p.cargo}</p>
              <p><strong>Poder:</strong> {p.poder}</p>
            </div>
          ))}
        </div>
      )}


      {personagemSelecionado && (
        <div className="card text-center">
          <img src={personagemSelecionado.imagem} className="card-img-top mx-auto" alt={personagemSelecionado.nome} style={{ width: '300px' }} />
          <div className="card-body">
            <h2>{personagemSelecionado.nome}</h2>
            <p>{personagemSelecionado.sumario}</p>
            <button className="btn btn-secondary mt-2" onClick={() => setPersonagemSelecionado(null)}>Voltar</button>
          </div>
        </div>
      )}
    </div>
  );

}

export default App
