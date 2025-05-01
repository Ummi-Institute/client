import { FC } from 'react'
import { TextInput, TextInputProps } from '@mantine/core'

import styles from './BrandInput.module.css'

const BrandInput: FC<TextInputProps> = (props) => {
    return (
        <TextInput
            {...props}
            radius={'xl'}
            c={'#151965'}
            className={styles.input}
        />
    )
}

export default BrandInput
