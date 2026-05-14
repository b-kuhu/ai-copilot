
// catches any error that occurs in the routes/controller and send error response
export default function errorHandler(err, req, res, next) {
 
  res.status(err.status || 500).json({
    error: {
      message: err.message, 
    }
   })
}