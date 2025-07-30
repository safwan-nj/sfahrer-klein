
const CreateJobs = (invoiceData, longitude, latitude) => {
  const jobsData = invoiceData.length > 0 ? invoiceData
    .filter(invoice => !isNaN(Number(invoice.lon)) && !isNaN(Number(invoice.lat))) // التحقق من صحة الإحداثيات
    .map((invoice, index) => ({
      id: index + 1,
      location: [Number(invoice.lon), Number(invoice.lat)]
    })) : [];
  
  const organizedData = {
    vehicles: [
      {
        id: 1,
        start: [(longitude < 0) || (longitude == null) || (latitude < 0) || (latitude == null) ? 12.9899 : longitude, (latitude < 0) || (latitude == null) ? 47.7939 : latitude],
        end: [(longitude < 0) || (longitude == null) || (latitude < 0) || (latitude == null) ? 12.9899 : longitude, (latitude < 0) || (latitude == null) ? 47.7939 : latitude]
      }
    ],
    jobs: jobsData
  };
  return organizedData;
};


export default CreateJobs;
