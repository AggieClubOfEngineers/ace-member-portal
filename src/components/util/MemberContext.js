// MyContext.js
import React from 'react';

const MemberContext = React.createContext({
    data: {},
    updateData: () => {}  // make sure this is defined here, even if it's just a stub
});

export default MemberContext;
