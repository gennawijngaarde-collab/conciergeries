import { Card, CardContent } from '@/components/ui/card';

export const MentionsLegales = () => (
  <div className="min-h-screen bg-gray-50 py-12">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">
        Mentions légales
      </h1>
      
      <Card>
        <CardContent className="p-6 lg:p-8 space-y-8">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Éditeur du site</h2>
            <p className="text-gray-600">
              <strong>Conciergeries France</strong><br />
              Éditeur / Créateur : <strong>Gennarro Wijngaarde</strong><br />
              Statut : <strong>Micro-entreprise</strong><br />
              Résidence : Île-de-France, France<br />
              Adresse postale : <strong>Arpajon (91290), France</strong><br />
              SIRET : 853 560 746 00010<br />
              N° TVA intracommunautaire : <em>Non applicable (si franchise en base de TVA)</em><br />
              Directeur de la publication : <strong>Gennarro Wijngaarde</strong>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Hébergement</h2>
            <p className="text-gray-600">
              <strong>Vercel Inc.</strong><br />
              340 S Lemon Ave #4133<br />
              Walnut, CA 91789<br />
              États-Unis
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Contact</h2>
            <p className="text-gray-600">
              Email : contact@conciergeries-france.fr<br />
              Téléphone : 01 76 50 50 50
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Propriété intellectuelle</h2>
            <p className="text-gray-600">
              L'ensemble du contenu de ce site (textes, images, logos, etc.) est la propriété 
              exclusive de Conciergeries France / Gennarro Wijngaarde. Toute reproduction, représentation ou 
              diffusion, totale ou partielle, du contenu de ce site par quelque procédé que 
              ce soit, sans autorisation expresse et préalable, est interdite et constituerait 
              une contrefaçon sanctionnée par les articles L.335-2 et suivants du Code de 
              la propriété intellectuelle.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Liens hypertextes</h2>
            <p className="text-gray-600">
              Le site peut contenir des liens hypertextes vers d'autres sites. 
              Conciergeries France n'assume aucune responsabilité quant au contenu 
              de ces sites externes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Données personnelles</h2>
            <p className="text-gray-600">
              Les données personnelles collectées sur ce site sont traitées conformément 
              à notre politique de confidentialité. Pour plus d'informations, veuillez 
              consulter notre page <a href="/confidentialite" className="text-blue-600 hover:underline">Politique de confidentialité</a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Cookies</h2>
            <p className="text-gray-600">
              Ce site utilise des cookies pour améliorer l'expérience utilisateur. 
              Vous pouvez configurer votre navigateur pour refuser les cookies.
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  </div>
);

export const Confidentialite = () => (
  <div className="min-h-screen bg-gray-50 py-12">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">
        Politique de confidentialité
      </h1>
      
      <Card>
        <CardContent className="p-6 lg:p-8 space-y-8">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Introduction</h2>
            <p className="text-gray-600">
              Conciergeries France s'engage à protéger la vie privée des utilisateurs 
              de son site. Cette politique de confidentialité explique comment nous 
              collectons, utilisons et protégeons vos données personnelles.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Données collectées</h2>
            <p className="text-gray-600 mb-4">
              Nous collectons les données suivantes :
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Nom et prénom</li>
              <li>Adresse email</li>
              <li>Numéro de téléphone</li>
              <li>Adresse IP</li>
              <li>Données de navigation</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Finalités du traitement</h2>
            <p className="text-gray-600 mb-4">
              Vos données sont collectées pour les finalités suivantes :
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Répondre à vos demandes de contact</li>
              <li>Vous envoyer notre newsletter (avec votre consentement)</li>
              <li>Améliorer notre site et nos services</li>
              <li>Respecter nos obligations légales</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Base légale</h2>
            <p className="text-gray-600">
              Le traitement de vos données est fondé sur votre consentement, l'exécution 
              de nos services, ou le respect de nos obligations légales.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Durée de conservation</h2>
            <p className="text-gray-600">
              Vos données sont conservées pendant la durée nécessaire aux finalités 
              pour lesquelles elles ont été collectées, et au maximum 3 ans après 
              notre dernier contact.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Vos droits</h2>
            <p className="text-gray-600 mb-4">
              Conformément au RGPD, vous disposez des droits suivants :
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Droit d'accès à vos données</li>
              <li>Droit de rectification</li>
              <li>Droit à l'effacement (droit à l'oubli)</li>
              <li>Droit à la limitation du traitement</li>
              <li>Droit d'opposition</li>
              <li>Droit à la portabilité</li>
            </ul>
            <p className="text-gray-600 mt-4">
              Pour exercer ces droits, contactez-nous à :{' '}
              <a href="mailto:contact@conciergeries-france.fr" className="text-blue-600 hover:underline">
                contact@conciergeries-france.fr
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Sécurité</h2>
            <p className="text-gray-600">
              Nous mettons en œuvre des mesures techniques et organisationnelles 
              appropriées pour protéger vos données contre tout accès non autorisé, 
              modification, divulgation ou destruction.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Cookies</h2>
            <p className="text-gray-600">
              Notre site utilise des cookies pour améliorer votre expérience. 
              Vous pouvez configurer votre navigateur pour refuser les cookies, 
              mais certaines fonctionnalités du site pourraient ne pas fonctionner 
              correctement.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Modifications</h2>
            <p className="text-gray-600">
              Nous nous réservons le droit de modifier cette politique de confidentialité 
              à tout moment. Les modifications prendront effet dès leur publication sur le site.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Contact</h2>
            <p className="text-gray-600">
              Pour toute question concernant cette politique de confidentialité, 
              contactez-nous à :{' '}
              <a href="mailto:contact@conciergeries-france.fr" className="text-blue-600 hover:underline">
                contact@conciergeries-france.fr
              </a>
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  </div>
);

export const CGV = () => (
  <div className="min-h-screen bg-gray-50 py-12">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">
        Conditions générales de vente
      </h1>
      
      <Card>
        <CardContent className="p-6 lg:p-8 space-y-8">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Préambule</h2>
            <p className="text-gray-600">
              Les présentes conditions générales de vente régissent l'utilisation du site 
              Conciergeries France et les services proposés. En utilisant notre site, 
              vous acceptez sans réserve l'ensemble de ces conditions.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Définitions</h2>
            <p className="text-gray-600">
              <strong>"Site"</strong> : le site internet Conciergeries France<br />
              <strong>"Utilisateur"</strong> : toute personne utilisant le site<br />
              <strong>"Conciergerie"</strong> : professionnel référencé sur le site<br />
              <strong>"Services"</strong> : ensemble des fonctionnalités proposées par le site
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Objet</h2>
            <p className="text-gray-600">
              Le site Conciergeries France a pour objet de mettre en relation des propriétaires 
              de biens immobiliers avec des conciergeries spécialisées dans la gestion de 
              locations courte durée.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Accès au site</h2>
            <p className="text-gray-600">
              L'accès au site est gratuit. Les frais d'accès et d'utilisation du réseau 
              de télécommunications sont à la charge de l'utilisateur.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Services proposés</h2>
            <p className="text-gray-600">
              Le site propose les services suivants :
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mt-2">
              <li>Annuaire de conciergeries</li>
              <li>Comparaison de services</li>
              <li>Mise en relation avec les conciergeries</li>
              <li>Contenu informatif et conseils</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Responsabilité</h2>
            <p className="text-gray-600">
              Conciergeries France agit comme intermédiaire et ne peut être tenu responsable 
              des prestations fournies par les conciergeries référencées. Nous nous efforçons 
              de vérifier l'exactitude des informations mais ne garantissons pas l'absence 
              d'erreurs.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Propriété intellectuelle</h2>
            <p className="text-gray-600">
              L'ensemble du contenu du site est protégé par les lois relatives à la propriété 
              intellectuelle. Toute reproduction non autorisée est interdite.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Données personnelles</h2>
            <p className="text-gray-600">
              Les données personnelles collectées sont traitées conformément à notre 
              politique de confidentialité.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Modification des CGV</h2>
            <p className="text-gray-600">
              Conciergeries France se réserve le droit de modifier les présentes conditions 
              générales à tout moment. Les modifications prendront effet dès leur publication 
              sur le site.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Droit applicable</h2>
            <p className="text-gray-600">
              Les présentes conditions générales sont soumises au droit français. En cas 
              de litige, les tribunaux français seront compétents.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Contact</h2>
            <p className="text-gray-600">
              Pour toute question concernant ces conditions générales, contactez-nous à :{' '}
              <a href="mailto:contact@conciergeries-france.fr" className="text-blue-600 hover:underline">
                contact@conciergeries-france.fr
              </a>
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  </div>
);
