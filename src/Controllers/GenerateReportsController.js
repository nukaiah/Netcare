import { generateIncidentReportExcelService } from "../Services/GenerateReportsService.js";

const generateIncidentReportExcelController = async (req, res, next) => {
    try {
        // Generate Excel Buffer from Service
        const buffer = await generateIncidentReportExcelService();

        // Download Response Headers
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );

        res.setHeader(
            "Content-Disposition",
            'attachment; filename="Disciplinary_Report.xlsx"'
        );

        // Send Buffer directly to Client Local Download
        return res.send(buffer);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export { generateIncidentReportExcelController };