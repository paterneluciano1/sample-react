import React, { Component } from 'react';
import './App.css';
import { FedaCheckoutButton } from 'fedapay-reactjs';

// Le composant ProductCard reste inchangé
class ProductCard extends Component {
  render() {
    const { product, publicKey } = this.props;
    
    // Configuration dynamique pour le bouton de paiement selon le produit
    
    const checkoutButtonOptions = {
      public_key: publicKey,
      transaction: {
        amount: product.price,
        description: product.description,
        callback_url: "http://reactsample.fedapay.com"
      },
      currency: {
        iso: product.currency
      },
      button: {
        class: 'btn btn-primary',
        text: `Payer ${product.price} ${product.currency}`
      },
      onComplete(resp) {
        const FedaPay = window['FedaPay'];
        if (resp.reason === FedaPay.DIALOG_DISMISSED) {
          window.location.href = "http://reactsample.fedapay.com";
          alert('Paiement annulé');
        } else {
          alert('Transaction terminée : ' + resp.reason);
          window.location.href = "http://reactsample.fedapay.com";
        }
        console.log(resp.transaction);
      }
    };

    return (
      <div className="col-md-4 mb-4">
        <div className="card">
          <img src={product.image} className="card-img-top" alt={product.name}/>
          <div className="card-body">
            <h5 className="card-title">{product.name}</h5>
            <p className="card-text">{product.description}</p>
            <p className="card-text"><strong>Prix : {product.price} {product.currency}</strong></p>
            <FedaCheckoutButton options={checkoutButtonOptions} />
          </div>
        </div>
      </div>
    );
  }
}

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [] // État initial vide
    };
  }

  componentDidMount() {
    // Récupération des données depuis le fichier JSON
    fetch('/products.json')
      .then(response => {
        if (!response.ok) {
          throw new Error("Erreur lors du chargement des produits");
        }
        return response.json();
      })
      .then(data => this.setState({ products: data }))
      .catch(error => console.error("Erreur: ", error));
  }

  render() {
    // Récupérer la clé publique depuis le fichier .env
    const PUBLIC_KEY = process.env.REACT_APP_PUBLIC_KEY;

    return (
      <div className="container">
        <h1 className="h1 mt-4 mb-3 text-center"><strong>Nos Produits</strong></h1>
        <div className="container mt-5">
          <div className="row">
            {this.state.products.length > 0 ? (
              this.state.products.map(product => (
                <ProductCard key={product.id} product={product} publicKey={PUBLIC_KEY} />
              ))
            ) : (
              <p>Chargement des produits....</p>
            )}
          </div>  
        </div>
        {/* Le container d'intégration de FedaPay (souvent utilisé pour le rendu de la modal ou de l'iframe) */}
      </div>
    );
  }
}
