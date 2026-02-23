import { useState } from 'react';
import { faqData } from '../data/faqData';

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Frequently Asked Questions
      </h1>
      <div className="space-y-3">
        {faqData.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
          >
            <button
              onClick={() => toggle(index)}
              className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
            >
              <span className="text-lg font-medium text-gray-800">
                {item.question}
              </span>
              <span
                className={`ml-4 flex-shrink-0 text-gray-500 transition-transform duration-200 ${
                  openIndex === index ? 'rotate-180' : ''
                }`}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </span>
            </button>
            {openIndex === index && (
              <div className="px-6 pb-4">
                <p className="text-gray-600 leading-relaxed">{item.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
