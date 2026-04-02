import { driver } from "driver.js";
import "driver.js/dist/driver.css";

export const startTour = () => {
    const driverObj = driver({
        showProgress: true,
        animate: true,
        stagePadding: 10,
        overlayColor: 'rgba(0, 0, 0, 0.8)',
        popoverClass: 'itr-tour-popover',
        nextBtnText: 'Próximo',
        prevBtnText: 'Voltar',
        doneBtnText: 'Começar Agora',
        allowClose: true,
        showButtons: ['next', 'previous', 'close'],
        steps: [
            {
                element: '#tour-acao-prioritaria',
                popover: {
                    title: 'Ação Prioritária',
                    description: 'Aqui é o seu motor de progresso. O sistema seleciona o que você realmente precisa estudar hoje.',
                    side: "right",
                    align: 'start'
                }
            },
            {
                element: '#tour-flashcards',
                popover: {
                    title: 'Flashcards',
                    description: 'Pratique seu vocabulário com o método de repetição espaçada (SRS) para nunca mais esquecer.',
                    side: "right",
                    align: 'start'
                }
            },
            {
                element: '#tour-atividades',
                popover: {
                    title: 'Atividades',
                    description: 'Desafios extras e jogos para acelerar sua imersão no idioma.',
                    side: "right",
                    align: 'start'
                }
            },
            {
                element: '#tour-dicionario',
                popover: {
                    title: 'Dicionário Pessoal',
                    description: 'Todo o seu vocabulário conquistado fica guardado aqui automaticamente.',
                    side: "right",
                    align: 'start'
                }
            },
            {
                element: '#tour-perfil',
                popover: {
                    title: 'Perfil de Aluno',
                    description: 'Acompanhe seu nível, conquistas e seus Certificados ITR.',
                    side: "right",
                    align: 'start'
                }
            },
            {
                element: '#tour-arsenal',
                popover: {
                    title: 'Arsenal ITR',
                    description: 'Este é o seu Arsenal ITR. Aqui você encontra as ferramentas de elite para destravar sua fluência, organizadas para o seu nível atual.',
                    side: "left",
                    align: 'start',
                }
            },
        ],
        onDestroyed: () => {
             localStorage.setItem('itr-tour-completed', 'true');
        }
    });

    driverObj.drive();
};

