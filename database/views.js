module.exports = {
  por_rfc: {
    map: function(doc) {
      if ('rfc' in doc) {
        emit(doc.rfc, doc);      
      }
    }.toString()
  }
};
