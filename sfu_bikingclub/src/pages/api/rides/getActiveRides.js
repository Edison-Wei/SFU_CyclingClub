
export default async function handler(req, res) {

    const { courseId } = req.query; // Extract course ID from the query parameters
  
    try {

  
      res.status(200).json({ activeRides });
    } catch (error) {
      console.error("Error in activeRides:", error);
      res.status(500).json({ error: error.message });
    }
}