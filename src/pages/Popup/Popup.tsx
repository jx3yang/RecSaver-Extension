import { render } from 'react-dom'

type Props = {
  
}

export const Popup: React.FC<Props> = ({}) => {
  return (
    <div>
      Sample popup
    </div>
  )
}

render(<Popup />, document.getElementById('popup'))
