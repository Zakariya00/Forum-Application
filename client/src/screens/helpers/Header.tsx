import React from 'react';

interface Props {
    title: string;

}
export const PageTitle: React.FC<Props> = ({ title }) => {
    return (
        <h1 className="display-4 text-center my-5">
            {title}
        </h1>
    );
};

export const MainTitle: React.FC<Props> = ({ title }) => {
    return (
        <h1 className="display-6 text-center my-5">
            {title}
        </h1>
    );
};

export const NormalTitle: React.FC<Props> = ({ title }) => {
    return (
        <h1 className="display-6 text-center my-5">
            {title}
        </h1>
    );
};