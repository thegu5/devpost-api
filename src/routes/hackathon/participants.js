import { x } from '../../utils.js'
import makeFetchCookie from 'fetch-cookie'
import FileCookieStore from '@root/file-cookie-store'
import * as cheerio from 'cheerio'
const store = new FileCookieStore('cookies.txt')
const fetchCookie = makeFetchCookie(fetch, new makeFetchCookie.toughCookie.CookieJar(store, {}))
// add cookie to fetchCookie

const parsePage = async function (html) {
  // set html to be the html of the page
  const data = await x(html, x('.participant', [{
    name: 'div.user-name > h5 ',
    username: '.inline-block > .user-profile-link@href | slug',
    url: '.inline-block > .user-profile-link@href',
    avatar: '.user_photo@src',
    stats: {
      projects: '.participant-software-count > strong | number',
      followers: '.participant-followers-count > strong | number',
      achievements: '.participant-achievements-count > strong | number'
    },
    specialty: 'span.role | trim',
    skills: ['h6:contains("Skills") + ul > li'],
    interests: ['h6:contains("Interests") + ul > li | trim'],
    teamStatus: 'div.team-up-state > span'
  }]))
  return data
}
const fetchPage = async function (url) {
  console.log('fetching ', url)
  return fetchCookie(url, {
    headers: {
      'X-Requested-With': 'XMLHttpRequest'
    }
  }).then(res => res.text())
}
export default async function (fastify, options) {
  // TODO: add authentication for this one; need to be logged in to view participants
  fastify.get('/:hackathon/participants', async (request, reply) => {
    const hackathon = request.params.hackathon
    const url = `https://${hackathon}.devpost.com/participants`
    console.log(url)
    let data = []
    const firstHTML = await fetchPage(url)
    // the total number of pages is the second to last child of ul.pagination
    const $ = cheerio.load(firstHTML)
    const lastPage = parseInt($('ul.pagination > li:nth-last-child(2) > a').text())
    console.log('last page is ' + lastPage)
    data = await parsePage(firstHTML)
    for (let i = 2; i <= lastPage; i++) {
      const pageHTML = await fetchPage(`${url}?page=${i}`)
      const pagedata = await parsePage(pageHTML)
      data.push(...pagedata)
    }
    return data
  })
}
