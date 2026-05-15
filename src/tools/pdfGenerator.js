export default {
    name: "pdfGenerator",
    description : "Generates a PDF from given railored resume content",
    async execute({ tailoredResume }) {
        console.log(tailoredResume);
        return "PDF generation is not implemented yet. This is a placeholder response.";
    }
}