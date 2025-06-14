import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Page from "@/components/Page";
import { faqData } from "@/data/faq";

const FaqPage = () => {
  const generalFaqs = faqData.filter((faq) => faq.category === "general");
  const logisticsFaqs = faqData.filter((faq) => faq.category === "logistics");

  return (
    <Page
      title="Frequently Asked Questions"
      description="More on logistics and hacker questions"
    >
      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-bold mb-4">General</h2>
          <Accordion type="single" collapsible className="w-full space-y-2">
            {generalFaqs.map((faq, index) => (
              <AccordionItem
                value={`general-${index}`}
                key={`general-${index}`}
                className="border-b"
              >
                <AccordionTrigger className="text-left font-medium text-md hover:no-underline cursor-pointer">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="pb-3">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4">Logistics</h2>
          <Accordion type="single" collapsible className="w-full space-y-2">
            {logisticsFaqs.map((faq, index) => (
              <AccordionItem
                value={`logistics-${index}`}
                key={`logistics-${index}`}
                className="border-b"
              >
                <AccordionTrigger className="text-left font-medium text-md hover:no-underline cursor-pointer">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="pt-1 pb-3">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </Page>
  );
};

export default FaqPage;
