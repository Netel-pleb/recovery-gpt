"use client"
import {useCallback, useState} from "react"
import ContentPanel from "@/components/ContentPanel"
import {Sidebar, SidebarLink} from "@/components/Sidebar"
import LoadConversation from "@/components/buttons/LoadConversation"
import SplashPage from "./SplashPage"
import {ChatLoader} from "@/components/ChatLoader"

function ChatInterface() {
  const [conversations, setConversations] = useState<RecoveryGPT.Conversations>([])
  const [links, setLinks] = useState<SidebarLink[]>([])
  const [loading, setLoading] = useState(false)
  const [activeConversation, setActiveConversation] = useState<RecoveryGPT.Conversation | null>(null)
  const [fileName, setFileName] = useState("Select a 'conversions.json' to review")
  let hasContent = conversations.length > 0

  const handleFileChange = useCallback((fileData: RecoveryGPT.Conversations) => {
    const links: SidebarLink[] = fileData.map((conversation) => ({
      label: conversation.title,
      url: conversation.id,
      date: conversation.create_time,
    }))

    setConversations(fileData)
    setActiveConversation(fileData[0] || null)
    setLinks(links)
  }, [])

  const handleLinkClick = useCallback((id: string) => {
    const conversation = conversations.find((conversation) => conversation.id === id)
    setActiveConversation(null) // Set activeConversation to null to show loading state
    setLoading(true)
    setActiveConversation(conversation || null) // Set activeConversation to display content
    setTimeout(() => {
      setLoading(false)
    }, 1000) // Wait for 2 seconds before displaying content
  }, [conversations])

  const UploadButton =
    <LoadConversation
      handleFileChange={handleFileChange}
      fileName={fileName}
      setFileName={setFileName}
    />

  return (
    <>
      <div className="overflow-hidden w-full h-screen relative flex z-0 bg-gray-700">
        {hasContent && <Sidebar selection={UploadButton} links={links} onLinkClick={handleLinkClick}/>}
        <div className="relative flex h-full max-w-full flex-1 overflow-hidden text-white">
          <div className="flex h-full max-w-full flex-1 flex-col">
            <main className="relative h-full w-full transition-width flex flex-col overflow-auto items-stretch flex-1">
              <div className="absolute right-4 top-2 z-10 hidden flex-col gap-2 md:flex"></div>
              <div className="flex-1 overflow-y-scroll">
                {hasContent ? (<>
                  <ChatLoader display={loading}/>
                  <ContentPanel activeConversation={activeConversation}/>
                </>) : (
                  <SplashPage action={UploadButton}/>
                )}
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  )
}

export default ChatInterface
