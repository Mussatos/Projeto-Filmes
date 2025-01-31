import api from '../../services/api';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './filme-info.css';
import { toast } from 'react-toastify';

function Filme(){

    const { id } = useParams();
    const navigate = useNavigate();

    const [filme, setFilme] = useState({});
    const [loading, setLoading] = useState(true); 

    useEffect(()=>{

        async function loadFilme() {
            
            await api.get(`movie/${id}`, {
                params:{
                    api_key:'abe01992bd7ef967fc857824ba2446d1',
                    language: "pt-BR",
                }
            })
            .then((response)=>{
                setFilme(response.data);
                setLoading(false);
            })
            .catch(()=>{
                navigate('/', { replace: true }); //o useNavigator envia automaticamente o usuário para o local indicao
                return;                           //o replace redireciona a URL do usuário 
            })
        }

        loadFilme();
        

        return(()=>{
            console.log('componente foi desmontado');
            }
        );

    }, [navigate, id]);

    function salvarFilme(){
        const minhaLista = localStorage.getItem("@primeFlix");

        let filmesSalvos = JSON.parse(minhaLista) || [];

        const hasFilme = filmesSalvos.some((filmesSalvos)=> filmesSalvos.id === filme.id);
        //some é um método do JS que é usado para comparar situações e devolver true ou false

        if(hasFilme){
            toast.warn("Esse filme já está na sua lista!");
            return;
        }

        filmesSalvos.push(filme);
        localStorage.setItem("@primeFlix", JSON.stringify(filmesSalvos));
        toast.success("Filme salvo com sucesso!");
        
    }

    if(loading){
        return(
            <div className='filme-info'>
                <h2>
                    Carregando detalhes do filme...
                </h2>
            </div>
        );
    }

    return(
        <div className='filme-info'>
                <h1>{filme.title}</h1>
                <img src={`https://image.tmdb.org/t/p/original/${filme.backdrop_path}`} alt={filme.title}/>

                <h3>Sinopse</h3>
                <span>{filme.overview}</span>

                <strong>Avaliação: {filme.vote_average} / 10</strong>
                
                <div className='area-buttons'>
                    <button onClick={salvarFilme}>Salvar</button>
                    <button>
                        <a target="blank" rel="external" href={`https://youtube.com/results?search_query=${filme.title} Trailer`}>
                        {/** blank é para o link abrir em outra página */}
                            Trailer
                        </a>
                    </button>
                </div>
            
        </div>
    );
}


export default Filme;