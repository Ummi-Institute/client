import { useState } from 'react'
import {
    Box,
    Text,
    Select as MantineSelect,
    NumberInput as MantineNumberInput,
} from '@mantine/core'

interface PanelProps {
    title: string
    children: React.ReactNode
    defaultExpanded?: boolean
    width?: string | number
}

const Panel = ({
    title,
    children,
    defaultExpanded = false,
    width = 320,
}: PanelProps) => {
    const [isExpanded, setIsExpanded] = useState(defaultExpanded)

    return (
        <Box
            style={{
                background: 'white',
                border: '2px solid #7048e8',
                borderRadius: 20,
                padding: '20px 30px',
                width: typeof width === 'number' ? `${width}px` : width,
                maxWidth: typeof width === 'number' ? `${width}px` : width,
                boxShadow: '0px 4px 8px rgba(0,0,0,0.1)',
            }}
        >
            <Text
                fz="xl"
                fw={700}
                c="#7048e8"
                style={{ cursor: 'pointer' }}
                onClick={() => setIsExpanded(!isExpanded)}
            >
                {isExpanded ? '▼' : '▶'} {title}
            </Text>
            {isExpanded && <Box mt={10}>{children}</Box>}
        </Box>
    )
}

// Subcomponent: Button
interface ButtonProps {
    label: string
    onClick: () => void
    disabled?: boolean
    size?: 'sm' | 'md' | 'lg' // Add size prop for customization
    width?: number | string
    height?: number | string
}

export const PanelButton = ({
    label,
    onClick,
    disabled = false,
    size,
    width,
    height,
}: ButtonProps) => {
    const sizeStyles = {
        sm: {
            padding: '4px 8px',
            fontSize: '12px',
        },
        md: {
            padding: '6px 12px',
            fontSize: '14px',
        },
        lg: {
            padding: '8px 16px',
            fontSize: '16px',
        },
    }

    return (
        <button
            style={{
                backgroundColor: disabled ? '#ccc' : '#7048e8',
                color: 'white',
                border: 'none',
                borderRadius: '17px',
                cursor: disabled ? 'not-allowed' : 'pointer',
                fontSize: '20px',
                ...(size ? sizeStyles[size] : {}), // Apply size styles dynamically if size is defined
                transition: 'background-color 0.3s ease',
                width: typeof width === 'number' ? `${width}px` : width,
                maxWidth: typeof width === 'number' ? `${width}px` : width,
                height: typeof height === 'number' ? `${height}px` : height,
                maxHeight: typeof height === 'number' ? `${height}px` : height,
            }}
            onClick={onClick}
            disabled={disabled}
        >
            {label}
        </button>
    )
}

// Subcomponent: Input
interface InputProps {
    value: number
    onChange: (value: number) => void
    min?: number
    max?: number
}

export const PanelInput = ({
    value,
    onChange,
    min = 0,
    max = 100,
}: InputProps) => (
    <MantineNumberInput
        value={value}
        onChange={(val) => onChange(typeof val === 'number' ? val : min)}
        min={min}
        max={max}
        radius="md"
        styles={{
            input: {
                borderColor: '#7048e8',
                textAlign: 'center',
                fontWeight: 600,
                color: '#7048e8',
                backgroundColor: '#f9f9ff',
                borderRadius: '4px',
            },
            controls: { display: 'none' },
        }}
        hideControls={true}
    />
)

// Subcomponent: Select
interface SelectProps {
    data: string[] | { label: string; value: string }[]
    value: string | null
    onChange: (value: string | null) => void
}

export const PanelSelect = ({ data, value, onChange }: SelectProps) => (
    <MantineSelect
        data={data}
        value={value}
        onChange={onChange}
        radius="md"
        styles={{
            input: {
                borderColor: '#7048e8',
                color: '#7048e8',
                backgroundColor: '#f9f9ff',
                fontWeight: 600,
                borderRadius: '4px',
            },
            dropdown: {
                borderColor: '#7048e8',
                borderRadius: '4px',
            },
        }}
    />
)

export default Panel
