import { useState, useEffect } from 'react'
import Head from 'next/head'
import Heading from '../../components/heading'
import Footer from '../../components/footer'
import MailingList from '../../components/mailingList'
import Navbar from '../../components/navbar'
import Button from '../../components/form/button'
import SearchBar from '../../components/search/searchBar'
import ProfileContainer from '../../components/blocks/profileContainer'
import CheckboxGroup from '../../components/form/checkboxGroup'
import SpeakerForm from '@components/form/speakerForm'
import Loader from '@components/loader'
import Host from 'lib/models/host'
import {
  ContentState,
  convertToRaw,
  EditorState,
  convertFromRaw,
  convertFromHTML,
} from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import Meta from '@components/meta'
import meta from 'constants/meta'

const BookSpeaker = () => {
  // search variables
  const [userInput, setUserInput] = useState('')
  const [filter, setFilter] = useState([])
  // variable to contain checked speaker
  const [speakers, setSpeakers] = useState([])
  // variable to make button clickable or unclickable
  const [bookSpeaker, setBookSpeaker] = useState(false)
  // variable to contain hosts/speakers from backend
  const [hostsState, setHostsState] = useState([])
  // variable to toggle loading gif
  const [isLoading, setIsLoading] = useState(true)
  // variable to toggle error message
  const [hasError, setHasError] = useState(false)
  // no speaker selected
  const [errorMsg, setErrorMsg] = useState('')

  let host = new Host()

  useEffect(async () => {
    setIsLoading(true)
    setHasError(false)

    await host
      .getList()
      .then((response) => {
        for (let i = 0; i < response.data.length; i++) {
          //Host Description convertor start
          host = response.data[i]
          if (host.bio) {
            let state
            try {
              state = convertFromRaw(JSON.parse(host.bio))
            } catch {
              const blocksFromHTML = convertFromHTML(`<p>${host.bio}<p>`)
              state = ContentState.createFromBlockArray(
                blocksFromHTML.contentBlocks,
                blocksFromHTML.entityMap
              )
            }

            let descHTML = ''
            try {
              const rawContentState = convertToRaw(state)
              descHTML = draftToHtml(rawContentState)
            } catch (err) {
              console.log(err, 'err from draft')
            }
            response.data[i].bio = descHTML
          }
          //Host Description convertor end
        }
        setHostsState(response.data)
        setIsLoading(false)
      })
      .catch((error) => {
        console.log(error)
        setHasError(true)
        setIsLoading(false)
      })
  }, [])

  const updateResults = (e) => {
    if (userInput) {
      e.preventDefault()
      submitSearch()
    }
  }

  const submitSearch = async () => {
    setIsLoading(true)
    setHasError(false)

    let adjustedFilter = []
    for (const key in filter) {
      if (Object.hasOwnProperty.call(filter, key)) {
        const status = filter[key]

        if (status) {
          adjustedFilter.push(key)
        }
      }
    }

    await host
      .getListBySearch(adjustedFilter, userInput)
      .then((response) => {
        for (let i = 0; i < response.data.length; i++) {
          //Host Description convertor start
          host = response.data[i]
          if (host.bio) {
            let state
            try {
              state = convertFromRaw(JSON.parse(host.bio))
            } catch {
              const blocksFromHTML = convertFromHTML(`<p>${host.bio}<p>`)
              state = ContentState.createFromBlockArray(
                blocksFromHTML.contentBlocks,
                blocksFromHTML.entityMap
              )
            }

            let descHTML = ''
            try {
              const rawContentState = convertToRaw(state)
              descHTML = draftToHtml(rawContentState)
            } catch (err) {
              console.log(err, 'err from draft')
            }
            response.data[i].bio = descHTML
          }
          //Host Description convertor end
        }
        setHostsState(response.data)
        setIsLoading(false)
      })
      .catch((error) => {
        console.log(error)
        setHasError(true)
        setIsLoading(false)
      })
  }

  return (
    <div className="min-h-fullpage">
      <Meta
        title={meta.bookASpeaker.title}
        keywords={meta.bookASpeaker.keywords}
        description={meta.bookASpeaker.description}
      />
      <header className="w-full">
        <Navbar />
      </header>
      <main className="pb-12">
        <Heading
          heading="Book a Speaker"
          breadcrumbs={[
            {
              link: '/',
              label: 'Home',
            },
            {
              link: '/events-classes',
              label: 'Events & Classes',
            },
            {
              link: '/events-classes/book-speaker',
              label: 'Book a Speaker',
            },
          ]}
        />
        {/* <p className="px-5 mx-auto mb-6 text-sm leading-6 text-center max-w-wrapper sm:text-base sm:mb-10">
          Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut
          fugit, sed quia consequuntur magni dolores eos qui.
        </p> */}
        <div className="px-5 mx-auto max-w-form md:px-0">
          <SearchBar
            placeholder="What topics and speakers are you interested in?"
            updateUserInputProp={(newUserInput) => {
              setUserInput(newUserInput)
            }}
            submitSearchProp={updateResults}
          />
        </div>
        <div className="px-5 mx-auto my-6 max-w-wrapper sm:my-10">
          <CheckboxGroup
            label="Book this speaker"
            filter={true}
            options={[
              {
                id: 'hebrew',
                name: 'hebrew',
                label: 'Hebrew',
              },
              {
                id: 'jewish-thought',
                name: 'jewish-thought',
                label: 'Jewish Thought',
              },
              {
                id: 'art-and-art-history',
                name: 'art_and_art_history',
                label: 'Art and Art History',
              },
              {
                id: 'current-affairs',
                name: 'current_affairs',
                label: 'Current Affairs',
              },
              {
                id: 'literature',
                name: 'literature',
                label: 'Literature',
              },
              {
                id: 'culture-and-media',
                name: 'culture_and_media',
                label: 'Culture and Media',
              },
            ]}
            valueProp={(value) => {
              setFilter(value)
            }}
            hideLabel={true}
          />
        </div>
        <div className="flex items-center justify-center w-full px-5 my-10 sm:my-12">
          {!isLoading && (
            <Button
              type="button"
              buttonContent="Find Speakers"
              action={() => submitSearch()}
              className="w-full mx-auto sm:w-auto"
            />
          )}
        </div>
        {isLoading && <Loader message={'Loading...'} />}
        {hostsState.length > 0 && !isLoading && (
          <ProfileContainer
            updateSpeakersProp={(speakersList) => setSpeakers(speakersList)}
            schema={hostsState}
          />
        )}
        {hostsState.length == 0 && !isLoading && !hasError && (
          <div className="justify-center mx-auto max-w-wrapper">
            <p className="text-center">No Speaker(s) Found.</p>
          </div>
        )}
        {!isLoading && hasError && (
          <div className="justify-center mx-auto max-w-wrapper">
            <p className="text-center text-red-600">
              Ops! Sorry something went wrong getting the list of speaker(s).
            </p>
          </div>
        )}
        {hostsState.length > 0 && !isLoading && (
          <div className="flex items-center justify-center w-full px-5 my-10 sm:my-12 flex-col">
            <Button
              type="button"
              buttonContent="Book Speaker(s)"
              action={() => {
                if (speakers.length) {
                  setBookSpeaker(true)
                  setErrorMsg('')
                  window.scrollTo(0, 0)
                } else {
                  setErrorMsg(
                    'Please select at least one speaker before clicking the "Book Speaker(s)" button above.'
                  )
                }
              }}
            />
            {errorMsg && (
              <p className="font-mont text-red-150 text-center mt-4">
                {errorMsg}
              </p>
            )}
          </div>
        )}
        {bookSpeaker && (
          <SpeakerForm
            closeProp={() => setBookSpeaker(false)}
            selectedSpeakers={speakers}
          />
        )}
      </main>
      <MailingList />
      <Footer />
    </div>
  )
}

export default BookSpeaker
