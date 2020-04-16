const cookiestore = ' '; //store cookies
const URL = 'https://cfw-takehome.developers.workers.dev/api/variants';//PARSE JSON objects from thiis LINK


addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})
/**
 * Return one of 2 URLs
 * @param {Request} request
 */
async function handleRequest(request){
	//collect list of urls from the Json 
	let response = await fetch(URL);
	let urls = await response.json();//converting JSON to Javascript Objects
	

	//if cookies exist, set page. else, randomly select page and set cookie
	const cookie = await getCookie(request, cookiestore);
	let x; 
	if(cookie){
		x = cookie;
	} else {
		x = await Math.round(Math.random()); //random fuction is to get either 0 or 1 with 50/50 probability
	}

	//Fetching  data from url and modifying HTML elements:
	const res = await fetch(urls.variants[x]);
	const rewrote = await new HTMLRewriter().on('*', new Modify(x)).transform(res);
	
	//append a cookie if not previously set
	if(!cookie){ await rewrote.headers.append('Set-Cookie', `${cookiestore}=${x}; path=/`); }
	return rewrote;
}




//Below Data is used to rewirte the HTML
data = [
{
	'title' : 'PAGE 1',
	'h1#title' : 'I am Vishal Devxo',
	'p#description' : 'I love to code.',
	'a#url' : 'Check out my Git Tutorial.',
	'link_out' : 'https://codeskulls.comg/git' 
},
{
	'title' : 'PAGE 2',
	'h1#title' : 'I am From TEAM Codeskulls',
	'p#description' : 'I like to explore.',
	'a#url' : 'Check out my Docker Tutorial.',
	'link_out' : 'https://codeskulls.com/docker'
}
]

//Below code is taken from Rewrite Links In HTML worker script Template

class Modify {
	constructor(num){
		this.dict = data[num];
	}
	element(element){
		//get element name#id
		let name = element.tagName ;
		let id = element.getAttribute('id');
		if(id!=null){ name += ('#' + id); }

		//if element should be replaced, replace it
		if(this.dict.hasOwnProperty(name)){
			element.setInnerContent(this.dict[name]);
		}
		//for a#url, modify the link
		if(name=='a#url'){
			element.setAttribute('href', this.dict['link_out']);
		}
	}
}

/**
 * Grabs the cookie with name from the request headers
 * @param {Request} request incoming Request
 * @param {string} name of the cookie to grab
 */
function getCookie(request, name) {
  let result = null
  let cookieString = request.headers.get('Cookie')
  if (cookieString) {
    let cookies = cookieString.split(';')
    cookies.forEach(cookie => {
      let cookieName = cookie.split('=')[0].trim()
      if (cookieName === name) {
        let cookieVal = cookie.split('=')[1]
        result = cookieVal
      }
    })
  }
  return result
} // The above code is taken from Extract Cookie Value worker script Template