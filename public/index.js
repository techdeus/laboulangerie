function Home() {
    return(
        <div className="wrapper">
            <div className="title">welcome to laboulangerie inventory</div>
            <button class="addProduct">add a product</button>
            <button class="updateProduct">update a product</button>
           
        </div>
    );
}

const domContainer = document.querySelector('#root');
ReactDOM.render(<Home />, domContainer);