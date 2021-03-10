const app = require("express")();
const fetch = require('node-fetch');
const { keyword, best, event, carousel, box } = require('./response.json');

const PORT = 3000;
const AMAZONPATH = 'https://completion.amazon.com/api/2017/suggestions?mid=ATVPDKIKX0DER&alias=aps&suggestion-type=KEYWORD&prefix=';

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, X-Requested-With");
  next();
});

app.get('/item', (req, res) => {
  const { query : { type, page, count } } = req;
  res.status(200);

  switch(type) {
    case 'best'    : res.json(best); break;
    case 'event'   : res.json(event); break;
    case 'carousel': res.json(carousel); break;
    case 'best'    : res.json(best); break;
    case 'box'     : res.json(getBoxList({page, count})); break;
    default : res.status(400); break;
  }
});

app.get('/length', (req, res) => {
  res.status(200);
  res.json({ length : box.list.length });
  res.end();
});

app.get('/keyword', (req, res) => {
  res.status(200);
  res.json(keyword);
  res.end();
});

app.get('/search', async (req, res) => {
  const { query : { word } } = req;
  try {
    res.status(200);
    const data = await fetch(AMAZONPATH + word);
    const json = await data.json();
    const result = json.suggestions.reduce((acc, cur) => [...acc, cur.value], []);
    res.json({'list' : result});
  } catch (error) {
    console.log(error);
    res.status(500);
  } finally {
    res.end();
  }
});

const getBoxList = ({ page, count }) => {
  if(!page || !count) {
    return {error: 'page 또는 count 누락'};
  }
  if(page * count > box.list.length) {
    return {error: '잔여 상품 없음'};
  }
  return {
    prefix : box.prefix,
    list : box.list.slice(count * page - count, count * page)
  };
};

app.listen(PORT, () => {
  console.log(`Server Loaded, http://localhost:${PORT}`);
});
