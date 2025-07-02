import React, { useEffect, useState } from 'react';

const ThemeToggler: React.FC = () => {
	const [dark, setDark] = useState<boolean>(false);

	useEffect(() => {
		document.body.className = dark
			? 'bg-dark text-white'
			: 'bg-white text-dark';
	}, [dark]);

	return (
		<div className='form-check form-switch mt-3 px-3'>
			<input
				className='form-check-input'
				type='checkbox'
				checked={dark}
				onChange={() => setDark((prev) => !prev)}
			/>
			<label className='form-check-label'>Dark Mode</label>
		</div>
	);
};

export default ThemeToggler;