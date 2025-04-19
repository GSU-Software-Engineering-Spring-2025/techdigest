
export interface Category {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  color: string;
}

export const categories: Category[] = [
  {
    id: "ai",
    name: "AI",
    description: "Artificial Intelligence developments and applications",
    imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995",
    color: "bg-blue-500"
  },
  {
    id: "ml",
    name: "ML",
    description: "Machine Learning techniques and research",
    imageUrl: "https://images.unsplash.com/photo-1555949963-aa79dcee981c",
    color: "bg-green-500"
  },
  {
    id: "robotics",
    name: "Robotics",
    description: "Advances in robotics and automation",
    imageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e",
    color: "bg-red-500"
  },
  {
    id: "blockchain",
    name: "Blockchain",
    description: "Distributed ledger technologies and applications",
    imageUrl: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0",
    color: "bg-yellow-500"
  },
  {
    id: "iot",
    name: "IoT",
    description: "Internet of Things devices and ecosystems",
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475",
    color: "bg-purple-500"
  },
  {
    id: "quantum-computing",
    name: "Quantum Computing",
    description: "Quantum computing research and applications",
    imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb",
    color: "bg-indigo-500"
  },
  {
    id: "vr-ar",
    name: "VR/AR",
    description: "Virtual and augmented reality technologies",
    imageUrl: "https://images.unsplash.com/photo-1592478411213-6153e4ebc07d",
    color: "bg-pink-500"
  },
  {
    id: "networking",
    name: "Networking",
    description: "Advances in network technologies and protocols",
    imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31",
    color: "bg-orange-500"
  }
];

export const getCategoryById = (id: string): Category | undefined => {
  return categories.find(category => category.id === id);
};
