import CustomButton from "./CustomButton"


const FilePicker = ({ file, setFile, readFile }) => {
    return (
        <div className="filepicker-container ">
            <div className="flex-1 flex flex-col">
                <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    onChange={e => setFile(e.target.files[0])}
                />
                <label htmlFor="file-upload" className="filepicker-label">
                    Select a file
                </label>
                <p>
                    {file === '' ? "No file selected" : file.name}
                </p>
            </div>
            <div className="flex flex-wrap gap-3 mt-4">
                <CustomButton
                    type='outline'
                    title='Logo'
                    text="Upload"
                    customStyles="text-xs "
                    handleClick={() => readFile('logo')}
                />
                <CustomButton
                    type='filled'
                    title='Full'
                    text="Upload"
                    customStyles="text-xs "
                    handleClick={() => readFile('full')}
                />
            </div>
        </div>
    )
}

export default FilePicker
