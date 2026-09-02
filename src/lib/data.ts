import { Professional } from './types';

export const mockProfessionals: Professional[] = [
  {
    id: '1',
    name: 'Lauro Domingues Neto',
    specialty: 'Pedreiro',
    rating: 5,
    photoProfile: 'https://images.unsplash.com/photo-1779896412277-c4fd15c7a89c?q=80&w=1096&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    location: 'Centro, Capela do Alto - SP',
    description: 'Especialista em alvenaria, rebocagem e acabamentos finos. Mais de 15 anos de experiência em reformas residenciais.',
    photosPortfolio: [
      'https://plus.unsplash.com/premium_photo-1674514923661-033f3b045d55?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // parede tijolos
      'https://plus.unsplash.com/premium_photo-1681989490797-dbe51c438b61?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // obra ferramentas
      'https://plus.unsplash.com/premium_photo-1681589434478-b3122f353b44?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // medição/gesso
      'https://images.unsplash.com/photo-1615461476249-718ef8bc369c?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'  // concreto/estrutura
    ]
  },
  {
    id: '2',
    name: 'Ana Carolina Souza',
    specialty: 'Faxineira',
    rating: 5,
    photoProfile: 'https://plus.unsplash.com/premium_photo-1781833001413-be0b4c1b3b9e?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    location: 'Centro, Sorocaba - SP',
    description: 'Limpeza residencial e comercial. Organização de ambientes e cuidado com móveis delicados. Pontualidade garantida.',
    photosPortfolio: [
      'https://images.unsplash.com/photo-1581578731548-c64695cc6954?q=80&w=400&auto=format&fit=crop',
      'https://plus.unsplash.com/premium_photo-1674514923661-033f3b045d55?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // cozinha limpa
      'https://plus.unsplash.com/premium_photo-1681989490797-dbe51c438b61?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // produtos e pano
      'https://plus.unsplash.com/premium_photo-1681589434478-b3122f353b44?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'  // banheiro brilhando
    ]
  },
  {
    id: '3',
    name: 'Roberto Silva',
    specialty: 'Encanador',
    rating: 4,
    photoProfile: 'https://plus.unsplash.com/premium_photo-1674514923661-033f3b045d55?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    location: 'Centro, Capela do Alto - SP',
    description: 'Instalações hidráulicas, reparo de vazamentos e manutenção de caixas d\'água. Trabalho rápido e limpo.',
    photosPortfolio: [
      'https://images.unsplash.com/photo-1504148455328-c376907d081c?q=80&w=400&auto=format&fit=crop', // ferramentas tubo
      'https://plus.unsplash.com/premium_photo-1674514923661-033f3b045d55?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // reparo pia
      'https://plus.unsplash.com/premium_photo-1681989490797-dbe51c438b61?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // encanamento banheiro
      'https://plus.unsplash.com/premium_photo-1681589434478-b3122f353b44?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'  // tubulações inox
    ]
  },
  {
    id: '4',
    name: 'Marcos Vinicius',
    specialty: 'Pedreiro',
    rating: 3,
    photoProfile: 'https://plus.unsplash.com/premium_photo-1674514923661-033f3b045d55?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    location: 'Centro, Iperó - SP',
    description: 'Construção civil básica, telhados e muros. Preços competitivos e agilidade na entrega da obra.',
    photosPortfolio: [
      'https://plus.unsplash.com/premium_photo-1615461476249-718ef8bc369c?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // fachada/casa em obra
      'https://plus.unsplash.com/premium_photo-1615461476249-718ef8bc369c?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // tijolos assentados
      'https://plus.unsplash.com/premium_photo-1615461476249-718ef8bc369c?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // colher de pedreiro
      'https://plus.unsplash.com/premium_photo-1615461476249-718ef8bc369c?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'  // estrutura cobertura
    ]
  },
  {
    id: '5',
    name: 'Sueli Pereira',
    specialty: 'Baba',
    rating: 5,
    photoProfile: 'https://plus.unsplash.com/premium_photo-1674514923661-033f3b045d55?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Corrigido para foto de mulher real
    location: 'Centro, Capela do Alto - SP',
    description: 'Cuidado infantil com muito carinho e responsabilidade. Experiência com todas as idades.',
    photosPortfolio: [
      'https://plus.unsplash.com/premium_photo-1674514923661-033f3b045d55?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // brinquedos educativos
      'https://plus.unsplash.com/premium_photo-1674514923661-033f3b045d55?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // interação/desenho
      'https://plus.unsplash.com/premium_photo-1674514923661-033f3b045d55?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // leitura de histórias
      'https://plus.unsplash.com/premium_photo-1674514923661-033f3b045d55?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'  // quarto de criança organizado
    ]
  },
  {
    id: '6',
    name: 'Darcy Carriel',
    specialty: 'Efetiva',
    rating: 4.5,
    photoProfile: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop',
    location: 'Centro, Capela do Alto - SP',
    description: 'Profissional de limpeza e governança doméstica contratada para serviços mensais e diários de grande eficiência. Especialização em organização técnica residencial, lavanderia profissional e conservação de ambientes de alto padrão.',
    photosPortfolio: [
      'https://unsplash.com', // quarto de luxo arrumado
      'https://unsplash.com', // armário/closet organizado
      'https://unsplash.com', // toalhas e lençóis dobrados
      'https://unsplash.com'  // sala de estar impecável
    ]
  }
];