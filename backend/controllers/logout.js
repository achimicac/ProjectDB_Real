export const  logout = async (req, res) => {
      try {
            res.clearCookie("userRegistered");
            
            
      } catch (error) {
            console.log(error);
      }
}
//module.exports = logout;