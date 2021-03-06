function create_chunk(str, length) {
  return str.match(new RegExp('.{1,' + length + '}', 'g'));
}

function clean_chunks(array) {
  try {
    return array.join("").replace(/(\r\n|\n|\r)/gm, ""); 
  } catch (e) {
    console.log(e);
  }
}

module.exports = {
  chunkIt: create_chunk,
  cleanChunks: clean_chunks
}