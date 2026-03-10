import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const FAQ = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="text-center">
            <Badge className="mb-4 bg-white/20 text-white hover:bg-white/30">FAQ</Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">Questions fréquentes</h1>
            <p className="text-lg text-blue-100">
              Propriétaires et conciergeries : retrouvez ici les réponses aux questions les plus courantes.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild className="bg-white text-blue-700 hover:bg-blue-50">
                <Link to="/devis">Obtenir des devis</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-white/40 text-white bg-transparent hover:bg-white/10 hover:text-white"
              >
                <Link to="/devenir-partenaire">Devenir partenaire</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-8">
          <Card className="shadow-xl border-0">
            <CardContent className="p-6 lg:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Propriétaires</h2>
              <p className="text-gray-600 mb-6">Tout ce qu’il faut savoir pour trouver une conciergerie.</p>

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="owner-1">
                  <AccordionTrigger>Comment obtenir des devis de conciergeries ?</AccordionTrigger>
                  <AccordionContent>
                    Rendez-vous sur la page <Link to="/devis" className="text-blue-600 hover:underline">Obtenir des devis</Link>,
                    décrivez votre bien et vos besoins. Vous recevez ensuite des propositions adaptées.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="owner-2">
                  <AccordionTrigger>Quels services une conciergerie peut gérer ?</AccordionTrigger>
                  <AccordionContent>
                    En général : création/optimisation d’annonce, tarification, gestion des réservations, accueil, ménage,
                    linge, maintenance et assistance voyageurs.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="owner-3">
                  <AccordionTrigger>Combien coûte une conciergerie Airbnb ?</AccordionTrigger>
                  <AccordionContent>
                    Les commissions varient souvent entre 15% et 25% selon la ville, la qualité de service et les options.
                    Comparez toujours ce qui est inclus (ménage, linge, photos, maintenance…).
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="owner-4">
                  <AccordionTrigger>Comment choisir la meilleure conciergerie ?</AccordionTrigger>
                  <AccordionContent>
                    Regardez les avis, la réactivité, la couverture locale, les services inclus, la transparence des coûts,
                    et demandez un plan d’optimisation (prix, annonces, qualité d’accueil).
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          <Card className="shadow-xl border-0">
            <CardContent className="p-6 lg:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Conciergeries partenaires</h2>
              <p className="text-gray-600 mb-6">Abonnement, badge et visibilité sur l’annuaire.</p>

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="partner-1">
                  <AccordionTrigger>À quoi sert l’espace partenaire ?</AccordionTrigger>
                  <AccordionContent>
                    Il permet de suivre le statut de votre abonnement et (bientôt) de compléter votre fiche (logo, zones,
                    description, coordonnées) pour apparaître dans l’annuaire avec votre badge.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="partner-2">
                  <AccordionTrigger>Comment obtenir le badge Standard ou Premium ?</AccordionTrigger>
                  <AccordionContent>
                    Choisissez un abonnement sur <Link to="/devenir-partenaire" className="text-blue-600 hover:underline">Devenir partenaire</Link>.
                    Une fois le paiement validé, votre statut est synchronisé automatiquement.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="partner-3">
                  <AccordionTrigger>Comment mettre à niveau ou annuler mon abonnement ?</AccordionTrigger>
                  <AccordionContent>
                    Depuis l’espace partenaire, vous pourrez accéder à un portail de gestion (upgrade/downgrade/annulation).
                    Si vous avez un besoin urgent, contactez-nous via la page Contact.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="partner-4">
                  <AccordionTrigger>Quand ma fiche apparaît-elle dans l’annuaire ?</AccordionTrigger>
                  <AccordionContent>
                    Dès que votre abonnement est actif, votre fiche peut être affichée dans l’annuaire. Si vous ne la voyez
                    pas immédiatement, rafraîchissez la page après quelques secondes.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FAQ;

