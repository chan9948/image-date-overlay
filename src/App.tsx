import { toPng } from 'html-to-image'
import React, { useEffect, useRef, useState } from 'react'

function App(): JSX.Element {
    const refs = useRef<HTMLElement[]>([])

    const [count, setCount] = useState(0)
    const [data, setData] = useState<
        { name: string; dataUrl: string; date: Date }[]
    >([])

    const onUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        setData([])
        refs.current = []

        const data: string[] = []

        const files = event.target.files

        if (!files) return

        setCount(files.length)

        for (const file of Array.from(files)) {
            const reader = new FileReader()

            reader.readAsDataURL(file)

            reader.onloadend = () => {
                console.log(reader.result)
                setData((prev) => [
                    ...prev,
                    {
                        name: file.name,
                        dataUrl: reader.result?.toString() ?? '',
                        date: new Date(file.lastModified),
                    },
                ])
            }

            data.push(reader.result?.toString() ?? '')
        }
    }

    useEffect(() => {
        if (count !== 0 && data.length === count) {
            let index = 0
            for (const div of refs.current) {
                toPng(div).then((url) => {
                    const link = document.createElement('a')
                    link.download = data[index++].name
                    link.href = url
                    link.click()
                })
            }
        }
    }, [count, data, refs])

    return (
        <div>
            <input
                onChange={onUpload}
                type={'file'}
                multiple
                accept="image/*"
            />
            <div>
                {data.map((data, index) => (
                    <div
                        ref={(component) => {
                            if (component) refs.current[index] = component
                        }}
                        key={index}
                        style={{
                            width: 'fit-content',
                            position: 'relative',
                        }}
                    >
                        <img
                            style={{ display: 'block', position: 'relative' }}
                            src={data.dataUrl}
                        />
                        <div
                            style={{
                                position: 'absolute',
                                bottom: 5,
                                right: 5,
                                color: '#fbc514',
                                fontWeight: 'bold',
                                fontSize: '1.5em',
                                textShadow: '0 0 3px #dd2b0e',
                            }}
                        >
                            {data.date.toLocaleString('en-HK', {
                                dateStyle: 'full',
                                timeStyle: 'long',
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default App
