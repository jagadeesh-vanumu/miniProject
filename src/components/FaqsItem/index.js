import './index.css'

const FaqsItem = props => {
  const {item} = props
  const {answer, question} = item

  return (
    <li className="faq-list-item">
      <p className="faq">{question}</p>
      <p className="answer">{answer}</p>
    </li>
  )
}
export default FaqsItem
