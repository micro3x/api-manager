import main from '../index';

function list(req, res) {
  main.s3.listObjects({Bucket: 'test'}, (error, data) => {
    res.send(data);
  })

}

module.exports = {
  list: list
}
