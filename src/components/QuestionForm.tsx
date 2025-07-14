import { useState } from "react";

interface QuestionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: QuestionFormData) => void;
}

export interface QuestionFormData {
  subject: string;
  description: string;
  location: string;
  categories: string[];
}

const CATEGORIES = [
  "Software",
  "Hardware",
  "Design",
  "Frontend",
  "Backend",
  "Machine Learning",
  "Ideation",
  "Git",
  "Computer Vision",
  "Android",
  "iOS",
  "Augmented Reality",
  "Game Development",
  "Blockchain",
  "Virtual Reality",
  "Cloud Computing",
  "Robotics",
  "Embedded",
  "Security",
  "Pitching",
  "Other",
];

function QuestionForm({ isOpen, onClose, onSubmit }: QuestionFormProps) {
  const [formData, setFormData] = useState<QuestionFormData>({
    subject: "",
    description: "",
    location: "",
    categories: [],
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleCategory = (category: string) => {
    setFormData((prev) => {
      const categories = prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category];
      return { ...prev, categories };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form data
    if (
      !formData.subject.trim() ||
      !formData.description.trim() ||
      !formData.location.trim()
    ) {
      alert("Please fill in all required fields");
      return;
    }

    onSubmit(formData);

    // Reset form data
    setFormData({
      subject: "",
      description: "",
      location: "",
      categories: [],
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-md bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">
            Submit a question to a mentor
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <span className="text-2xl">×</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Subject
            </label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              placeholder="What does your team need help with?"
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe your request. Some examples include what you want to do, the issue at hand, what you have tried, and tools used."
              className="w-full p-2 border rounded-md h-32"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="Where is your team located right now? Specify the room (e.g. beside Paper.id booth in Atrium 1)"
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Category <span className="text-gray-500 text-sm">(Optional)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => toggleCategory(category)}
                  className={`px-3 py-1 rounded-md text-sm ${
                    formData.categories.includes(category)
                      ? "bg-[#9F3737] text-white"
                      : "bg-gray-100 text-gray-700 border"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button
              type="submit"
              className="bg-[#9F3737] text-white px-4 py-2 rounded-md hover:bg-[#8A2F2F] transition-colors"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default QuestionForm;
