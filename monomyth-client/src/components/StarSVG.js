import React from "react"
import styled from "styled-components"

const StarIcon = styled.svg`
  height: 3rem;
  fill: ${props => props.isLiked ? props.theme.unlikeBtnBgColor : props.theme.likeBtnBgColor};
`

const StarSVG = (props) => {
  return (
    <StarIcon
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      viewBox="0 0 500 500"
      aria-hidden={true}
      isLiked={props.isLiked}
    >
      <g transform="matrix(0.9 0 0 0.9 250 250)" id="chww9jSu_1DVGKtlsI0kM"  >
        <path
          vectorEffect="non-scaling-stroke"
          transform=" translate(-250, -250)"
          d="M 250 0 C 388.07119 0 500 111.92881 500 250 C 361.92881 250 250 138.07119 250 0 z M 0 250 C 0 111.92881 111.92881 0 250 0 C 250 138.07119 138.07119 250 0 250 z M 500 250 C 500 388.07119 388.07119 500 250 500 C 250 361.92881 361.92881 250 500 250 z M 0 250 C 138.07119 250 250 361.92881 250 500 C 111.92881 500 0 388.07119 0 250 z"
          strokeLinecap="round"
        />
      </g>
    </StarIcon>
  )
}

export default StarSVG