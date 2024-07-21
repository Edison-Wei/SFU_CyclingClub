async function fetchMemberRoutes() {
    try {
      const res = await axios.get(`/api/Routes/getMemberRoutes`);
      return res.data;
    } catch (error) {
      console.error("Error fetching Member Routes: " + error)
      return ["Member Routes not found"];
    }
}

export default function MemberSubmissions() {

}