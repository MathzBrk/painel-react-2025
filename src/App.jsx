import { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'

function App() {

  const [personagens, setPersonagens] = useState([]);
  const [personagem, setPersonagemId] = useState(undefined);
  const [informacoesPersonagem, setInformacoesPersonagem] = useState({});

  useEffect(() => {
    if (!personagem) {
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
            .slice(0, 10);

          setPersonagens(dadosPersonagens);
          setInformacoesPersonagem([]);
          console.log(dadosPersonagens)
        })
    } else {
      axios.get(`https://naruto-br-api.site/characters/${personagem}`)
        .then(response => {
          setInformacoesPersonagem({
            nome: response.data.name,
            imagem: response.data.profile_image,
            sumario: response.data.summary
          })
        })

      console.log(personagem)
    }
  }, [personagem])


  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Personagens de Naruto</h1>

      {/* Lista de Personagens */}
      {!personagem && (
        <div className="d-flex flex-row flex-nowrap gap-4 justify-content-start" style={{ overflowX: 'auto' }}>
          {personagens.map((p) => (
            <div
              className="p-3"
              onClick={() => setPersonagemId(p.id)}
              style={{
                cursor: 'pointer',
                border: '1px solid #ddd',
                borderRadius: '8px',
                minWidth: '250px',
                maxWidth: '250px'
              }}
              key={p.id}
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

      {personagem && (
        <div className="card text-center">
          <img src={informacoesPersonagem.imagem} className="card-img-top mx-auto" alt={personagem} style={{ width: '300px' }} />
          <div className="card-body">
            <h2>{informacoesPersonagem.nome}</h2>
            <p>{informacoesPersonagem.sumario}</p>
            <button className="btn btn-secondary mt-2" onClick={() => setPersonagemId(undefined)}>Voltar</button>
          </div>
        </div>
      )}
    </div>
  );

}

export default App
