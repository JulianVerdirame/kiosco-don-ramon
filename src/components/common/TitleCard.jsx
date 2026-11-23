
export const TitleCard = ({ title, subtitle, icon: Icon, textButton, funcButton }) => {

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-4 bg-white p-3 rounded shadow-sm">
                <div>
                    <h4 className="fw-bold mb-0 text-dark">
                        <Icon className="me-2 text-primary" size={24} /> {title}
                    </h4>
                    <small className="text-muted">{subtitle}</small>
                </div>
                {textButton && (
                    <button
                        className="btn btn-primary d-flex align-items-center gap-2"
                        onClick={funcButton}
                    >
                        {textButton}
                    </button>
                )}
            </div>
        </>
    )
}